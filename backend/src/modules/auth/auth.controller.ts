import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ClerkAuthGuard } from './guards/clerk-auth.guard';
import { LoginResponseDto } from './dto/login.dto';
import { SyncUserDto } from './dto/sync-user.dto';
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
  @ApiBody({ type: SyncUserDto, required: false })
  @ApiResponse({ status: 201, description: 'User synced successfully', type: LoginResponseDto })
  async register(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: SyncUserDto,
  ) {
    const result = await this.authService.syncUser(
      user.userId,
      user.email,
      user.firstName,
      user.lastName,
      body?.name,
    );
    return {
      userId: result.user.clerkId,
      email: result.user.email,
      name: result.user.name,
      isNewUser: result.isNewUser,
      message: 'User registered/synced successfully',
    };
  }

  @Post('login')
  @UseGuards(ClerkAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Login a user' })
  @ApiBody({ type: SyncUserDto, required: false })
  @ApiResponse({ status: 200, description: 'Login successful', type: LoginResponseDto })
  async login(
    @CurrentUser() user: AuthenticatedUser,
    @Body() body: SyncUserDto,
  ) {
    const result = await this.authService.syncUser(
      user.userId,
      user.email,
      user.firstName,
      user.lastName,
      body?.name,
    );
    return {
      userId: result.user.clerkId,
      email: result.user.email,
      name: result.user.name,
      isNewUser: result.isNewUser,
      message: 'Login successful',
    };
  }
}
