import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsRepository } from './notifications.repository';
import { NotificationsController } from './notifications.controller';
import { FirebaseModule } from '../../firebase/firebase.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [FirebaseModule, AuthModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, NotificationsRepository],
  exports: [NotificationsService],
})
export class NotificationsModule {}
