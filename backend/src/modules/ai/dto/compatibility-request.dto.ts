import { IsArray, IsObject, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TranscriptMessage {
  @ApiProperty()
  @IsString()
  role: string;

  @ApiProperty()
  @IsString()
  content: string;
}

export class CompatibilityRequestDto {
  @ApiProperty({ type: [TranscriptMessage] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TranscriptMessage)
  transcript: TranscriptMessage[];

  @ApiProperty()
  @IsObject()
  twinAProfile: Record<string, any>;

  @ApiProperty()
  @IsObject()
  twinBProfile: Record<string, any>;

  @ApiProperty()
  @IsString()
  conversationSummary: string;
}
