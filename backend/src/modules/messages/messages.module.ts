import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { MessagesRepository } from './messages.repository';
import { FirebaseModule } from '../../firebase/firebase.module';
import { ConnectionsModule } from '../connections/connections.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';

/**
 * Human chat module. Reuses the existing ConnectionsService (via
 * ConnectionsModule) as the single source of truth for whether two users are
 * allowed to chat, so no second connection system is introduced.
 */
@Module({
  imports: [FirebaseModule, ConnectionsModule, NotificationsModule, UsersModule],
  controllers: [MessagesController],
  providers: [MessagesService, MessagesRepository],
  exports: [MessagesService],
})
export class MessagesModule {}
