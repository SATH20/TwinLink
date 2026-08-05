import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ description: 'Clerk user ID' })
  userId: string;

  @ApiProperty({ description: 'User email address' })
  email: string;

  @ApiProperty({ description: 'Whether the user is newly registered in Firestore' })
  isNewUser: boolean;

  @ApiProperty({ description: 'Response message' })
  message: string;
}
