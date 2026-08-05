import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StartConversationDto {
  @ApiProperty({ description: 'The user ID of the person to converse with' })
  @IsString()
  @IsNotEmpty()
  targetUserId: string;

  @ApiProperty({ description: 'Conversation context', default: 'first_meeting', required: false })
  @IsString()
  @IsOptional()
  context?: string = 'first_meeting';

  @ApiProperty({ description: 'Maximum number of turns', default: 10, required: false })
  @IsNumber()
  @IsOptional()
  @Min(4)
  @Max(20)
  maxTurns?: number = 10;
}
