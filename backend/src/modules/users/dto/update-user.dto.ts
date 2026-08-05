import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'Full name', required: false })
  @IsString()
  @IsOptional()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @ApiProperty({ description: 'Email address', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;
}
