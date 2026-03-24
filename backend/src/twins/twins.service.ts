import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateTwinDto } from './dto/create-twin.dto';
import { firstValueFrom } from 'rxjs';
import { db } from '../config/firebase.config';

@Injectable()
export class TwinsService {
  constructor(private readonly httpService: HttpService) {}

  findAll() {
    return { message: 'This will return all digital twins' };
  }

  async createTwin(createTwinDto: CreateTwinDto) {
    console.log('Received twin data:', createTwinDto);

    try {
      // Call FastAPI to generate twin profile
      const response = await firstValueFrom(
        this.httpService.post(
          'http://localhost:8000/generate-twin',
          createTwinDto
        )
      );

      console.log('FastAPI response:', response.data);

      // Prepare document for Firestore
      const twinDocument = {
        userInput: {
          interests: createTwinDto.interests,
          communicationStyle: createTwinDto.communicationStyle,
          goals: createTwinDto.goals,
          personality: createTwinDto.personality,
        },
        twinProfile: response.data.twinProfile,
        createdAt: new Date(),
      };

      // Save to Firestore
      const docRef = await db.collection('twins').add(twinDocument);

      console.log('Saved to Firestore with ID:', docRef.id);

      // Return response
      return {
        message: 'Twin created & stored successfully',
        twinId: docRef.id,
        data: response.data.twinProfile,
      };
    } catch (error) {
      console.error('Error:', error.message);

      // Handle different error types
      if (error.code === 'ECONNREFUSED') {
        return {
          message: 'AI service unavailable',
          error: 'FastAPI service is not running',
        };
      }

      return {
        message: 'Failed to create twin',
        error: error.message,
      };
    }
  }

  async getTopMatches(currentTwinId: string) {
    console.log('Finding matches for twin:', currentTwinId);

    try {
      // Fetch all twins from Firestore
      const snapshot = await db.collection('twins').get();

      if (snapshot.empty) {
        return {
          message: 'No twins found in database',
          matches: [],
        };
      }

      // Convert snapshot to array
      const allTwins = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as any[];

      // Find current twin
      const currentTwin = allTwins.find(twin => twin.id === currentTwinId);

      if (!currentTwin) {
        return {
          message: 'Twin not found',
          error: 'The specified twin ID does not exist',
        };
      }

      // Remove current twin from list
      const otherTwins = allTwins.filter(twin => twin.id !== currentTwinId);

      if (otherTwins.length === 0) {
        return {
          message: 'No other twins available for matching',
          matches: [],
        };
      }

      // Prepare data for FastAPI
      const matchRequest = {
        twin1: currentTwin.twinProfile,
        twins: otherTwins.map(twin => ({
          id: twin.id,
          ...twin.twinProfile,
        })),
      };

      // Call FastAPI matching endpoint
      const response = await firstValueFrom(
        this.httpService.post(
          'http://localhost:8000/match-twins',
          matchRequest
        )
      );

      console.log('Matching results:', response.data);

      // Return top matches
      return {
        message: 'Top matches found successfully',
        currentTwinId: currentTwinId,
        matches: response.data.matches,
      };
    } catch (error) {
      console.error('Matching error:', error.message);

      if (error.code === 'ECONNREFUSED') {
        return {
          message: 'AI service unavailable',
          error: 'FastAPI service is not running',
        };
      }

      return {
        message: 'Failed to find matches',
        error: error.message,
      };
    }
  }
}
