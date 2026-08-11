import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateConnectionDto {
  @ApiProperty({ description: 'Target user ID to connect with' })
  @IsString()
  @IsNotEmpty()
  targetUserId: string;

  @ApiProperty({ description: 'Conversation ID from the completed AI conversation' })
  @IsString()
  @IsNotEmpty()
  conversationId: string;
}
