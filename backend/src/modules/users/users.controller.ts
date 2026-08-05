import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AuthenticatedUser } from '../auth/interfaces/auth-user.interface';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    return this.usersService.getCurrentUser(user.userId);
  }

  @Put('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiBody({ type: UpdateUserDto })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  async updateMe(
    @CurrentUser() user: AuthenticatedUser,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(user.userId, updateUserDto);
  }
}
