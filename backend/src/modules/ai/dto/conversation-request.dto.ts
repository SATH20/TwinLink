import { IsObject, IsOptional, IsString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TwinData {
  @ApiProperty()
  @IsString()
  systemPrompt: string;

  @ApiProperty()
  @IsObject()
  memory: Record<string, any>;

  @ApiProperty()
  @IsObject()
  profile: Record<string, any>;
}

export class ConversationRequestDto {
  @ApiProperty({ type: () => TwinData })
  @IsObject()
  twinA: TwinData;

  @ApiProperty({ type: () => TwinData })
  @IsObject()
  twinB: TwinData;

  @ApiProperty({ required: false, description: 'Context of the conversation' })
  @IsString()
  @IsOptional()
  context?: string;

  @ApiProperty({ required: false, description: 'Maximum turns in the conversation' })
  @IsNumber()
  @IsOptional()
  maxTurns?: number;
}
