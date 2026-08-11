import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SyncUserDto {
  @ApiProperty({ description: 'Display name from the Clerk profile', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;
}
