import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { AppNotification } from './entities/notification.entity';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(ClerkAuthGuard)
@Controller('v1/notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'Returns all notifications for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of notifications' })
  async getNotifications(@CurrentUser('userId') userId: string): Promise<AppNotification[]> {
    return this.notificationsService.getNotifications(userId);
  }

  @Get('unread')
  @ApiOperation({ summary: 'Returns unread notifications for the authenticated user' })
  @ApiResponse({ status: 200, description: 'List of unread notifications' })
  async getUnreadNotifications(@CurrentUser('userId') userId: string): Promise<AppNotification[]> {
    return this.notificationsService.getUnreadNotifications(userId);
  }

  @Patch(':id/read')
  @ApiOperation({ summary: 'Marks notification as read' })
  @ApiParam({ name: 'id', description: 'The notification ID', type: String })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  @ApiResponse({ status: 404, description: 'Not found' })
  async markAsRead(@Param('id') id: string): Promise<void> {
    return this.notificationsService.markAsRead(id);
  }
}
