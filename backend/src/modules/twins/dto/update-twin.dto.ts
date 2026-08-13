import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { TwinStatus } from '../enums/twin-status.enum';

export class UpdateTwinDto {
  @ApiProperty({
    description: 'The current status of the digital twin',
    enum: TwinStatus,
    required: false,
  })
  @IsEnum(TwinStatus)
  @IsOptional()
  status?: TwinStatus;

  @ApiProperty({
    description: 'Additional custom prompt context to refine the twin behavior',
    required: false,
  })
  @IsString()
  @IsOptional()
  customPromptAdditions?: string;
}
