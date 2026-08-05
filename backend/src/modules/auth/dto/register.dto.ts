import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User first name', required: false })
  @IsString()
  @IsOptional()
  firstName?: string;

  @ApiProperty({ description: 'User last name', required: false })
  @IsString()
  @IsOptional()
  lastName?: string;
}
