import { Module, forwardRef } from '@nestjs/common';
import { ConnectionsController } from './connections.controller';
import { ConnectionsService } from './connections.service';
import { ConnectionsRepository } from './connections.repository';
import { FirebaseModule } from '../../firebase/firebase.module';
import { ConversationModule } from '../conversation/conversation.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { UsersModule } from '../users/users.module';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [
    FirebaseModule,
    forwardRef(() => ConversationModule),
    forwardRef(() => NotificationsModule),
    forwardRef(() => UsersModule),
    forwardRef(() => ProfilesModule),
  ],
  controllers: [ConnectionsController],
  providers: [ConnectionsService, ConnectionsRepository],
  exports: [ConnectionsService],
})
export class ConnectionsModule {}
