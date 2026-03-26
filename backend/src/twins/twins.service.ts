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
          {
            interests: createTwinDto.interests,
            communicationStyle: createTwinDto.communicationStyle,
            goals: createTwinDto.goals,
            personality: createTwinDto.personality,
          }
        )
      );

      console.log('FastAPI response:', response.data);

      // Prepare twin document for Firestore
      const twinDocument = {
        userId: createTwinDto.userId,
        category: createTwinDto.category,
        userInput: {
          interests: createTwinDto.interests,
          communicationStyle: createTwinDto.communicationStyle,
          goals: createTwinDto.goals,
          personality: createTwinDto.personality,
        },
        twinProfile: response.data.twinProfile,
        createdAt: new Date(),
      };

      // Save twin to Firestore
      const twinRef = await db.collection('twins').add(twinDocument);
      const twinId = twinRef.id;

      console.log('Saved twin to Firestore with ID:', twinId);

      // Check if user already exists
      const userDoc = await db.collection('users').doc(createTwinDto.userId).get();

      if (userDoc.exists) {
        // Update existing user with new twinId
        await db.collection('users').doc(createTwinDto.userId).update({
          twinId: twinId,
          category: createTwinDto.category,
          updatedAt: new Date(),
        });
        console.log('Updated existing user:', createTwinDto.userId);
      } else {
        // Create new user document
        await db.collection('users').doc(createTwinDto.userId).set({
          userId: createTwinDto.userId,
          email: createTwinDto.email,
          twinId: twinId,
          category: createTwinDto.category,
          createdAt: new Date(),
        });
        console.log('Created new user:', createTwinDto.userId);
      }

      // Return response
      return {
        message: 'Twin created & stored successfully',
        twinId: twinId,
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
      // Fetch current twin
      const currentTwinDoc = await db.collection('twins').doc(currentTwinId).get();

      if (!currentTwinDoc.exists) {
        return {
          message: 'Twin not found',
          error: 'The specified twin ID does not exist',
        };
      }

      const currentTwin = {
        id: currentTwinDoc.id,
        ...currentTwinDoc.data(),
      } as any;

      // Fetch twins with same category, excluding current user
      const snapshot = await db
        .collection('twins')
        .where('category', '==', currentTwin.category)
        .get();

      if (snapshot.empty) {
        return {
          message: 'No twins found in database',
          matches: [],
        };
      }

      // Convert snapshot to array and exclude current twin
      const otherTwins = snapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data(),
        }))
        .filter(twin => twin.id !== currentTwinId) as any[];

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

      // Return top 5 matches
      const topMatches = response.data.matches.slice(0, 5);

      return {
        message: 'Top matches found successfully',
        currentTwinId: currentTwinId,
        matches: topMatches,
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

  async getUserByUserId(userId: string) {
    console.log('Checking user:', userId);

    try {
      const userDoc = await db.collection('users').doc(userId).get();

      if (!userDoc.exists) {
        return {
          message: 'User not found',
          twinId: null,
        };
      }

      const userData = userDoc.data();

      return {
        message: 'User found',
        twinId: userData?.twinId || null,
        category: userData?.category || null,
        email: userData?.email || null,
      };
    } catch (error) {
      console.error('Error fetching user:', error.message);
      return {
        message: 'Failed to fetch user',
        error: error.message,
        twinId: null,
      };
    }
  }
}
