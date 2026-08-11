import { Controller, Get, Put, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/auth-user.interface';

@ApiTags('Profiles')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('v1/profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    try {
      return await this.profilesService.getProfile(user.userId);
    } catch (error) {
      return await this.profilesService.createProfile(user.userId);
    }
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBody({ type: UpdateProfileDto })
  @ApiResponse({ status: 200, description: 'Profile updated successfully' })
  async updateMe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.profilesService.updateProfile(user.userId, updateProfileDto);
  }

  @Patch('me/settings')
  @ApiOperation({ summary: 'Update privacy and/or notification preferences' })
  @ApiBody({ type: UpdateSettingsDto })
  @ApiResponse({ status: 200, description: 'Settings updated successfully' })
  async updateSettings(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateSettingsDto,
  ) {
    return this.profilesService.updateSettings(user.userId, dto);
  }

  @Get(':userId')
  @ApiOperation({ summary: 'Get another user profile by user ID (for match recommendations)' })
  @ApiResponse({ status: 200, description: 'Public profile with display name' })
  @ApiResponse({ status: 404, description: 'Profile not found' })
  async getByUserId(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId') userId: string,
  ) {
    return this.profilesService.getPublicProfile(userId, user.userId);
  }
}
