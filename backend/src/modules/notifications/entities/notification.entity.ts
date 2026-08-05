import { NotificationType } from '../enums/notification-type.enum';

export class AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data: Record<string, any>;
  read: boolean;
  createdAt: string;
}
