import { Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ClerkAuthGuard } from './guards/clerk-auth.guard';
import { LoginResponseDto } from './dto/login.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from './interfaces/auth-user.interface';

@ApiTags('Authentication')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register or sync a user' })
  @ApiResponse({ status: 201, description: 'User synced successfully', type: LoginResponseDto })
  async register(@CurrentUser() user: AuthenticatedUser) {
    const result = await this.authService.syncUser(
      user.userId,
      user.email,
      user.firstName,
      user.lastName,
    );
    return {
      userId: result.user.clerkId,
      email: result.user.email,
      isNewUser: result.isNewUser,
      message: 'User registered/synced successfully',
    };
  }

  @Post('login')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
  async login(@CurrentUser() user: AuthenticatedUser) {
    const result = await this.authService.syncUser(
      user.userId,
      user.email,
      user.firstName,
      user.lastName,
    );
    return {
      userId: result.user.clerkId,
      email: result.user.email,
      isNewUser: result.isNewUser,
      message: 'Login successful',
    };
  }
}
