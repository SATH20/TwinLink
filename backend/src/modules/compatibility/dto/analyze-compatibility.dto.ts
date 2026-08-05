import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyzeCompatibilityDto {
  @ApiProperty({ description: 'The ID of the conversation to analyze' })
  @IsString()
  @IsNotEmpty()
  conversationId: string;
}
