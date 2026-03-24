import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { CreateTwinDto } from './dto/create-twin.dto';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TwinsService {
  constructor(private readonly httpService: HttpService) {}

  findAll() {
    return { message: 'This will return all digital twins' };
  }

  async createTwin(createTwinDto: CreateTwinDto) {
    // Log incoming data
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

      // Return AI-generated twin profile
      return {
        message: 'Twin profile generated successfully',
        data: response.data,
      };
    } catch (error) {
      console.error('FastAPI error:', error.message);

      // Return error response if FastAPI is unavailable
      return {
        message: 'AI service unavailable',
        error: error.message,
      };
    }
  }
}
