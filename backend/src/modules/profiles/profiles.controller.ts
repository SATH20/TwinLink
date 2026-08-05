import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ProfilesService } from './profiles.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
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
}
