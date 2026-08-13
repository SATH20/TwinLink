import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTwinDto {
  @ApiProperty({
    description: 'Optional custom instructions or constraints to add to the generated AI prompt.',
    required: false,
    example: 'Always be very concise.',
  })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  customPromptAdditions?: string;
}
