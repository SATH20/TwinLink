import { IsObject, IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateTwinRequestDto {
  @ApiProperty({ description: 'Big Five personality traits mapping' })
  @IsObject()
  personality: Record<string, any>;

  @ApiProperty({ description: 'Core values of the user' })
  @IsArray()
  @IsString({ each: true })
  values: string[];

  @ApiProperty({ description: 'User interests and hobbies' })
  @IsArray()
  @IsString({ each: true })
  interests: string[];

  @ApiProperty({ description: 'Preferred communication style' })
  @IsString()
  communicationStyle: string;

  @ApiProperty({ description: 'Relationship goals' })
  @IsObject()
  goals: Record<string, any>;

  @ApiProperty({ description: 'Lifestyle preferences and habits' })
  @IsObject()
  lifestyle: Record<string, any>;

  @ApiProperty({ description: 'Partner preferences' })
  @IsObject()
  preferences: Record<string, any>;
}
