import { $enum } from 'ts-enum-util';

export enum NotificationType {
  USER = 'USER',
  SYSTEM = 'SYSTEM'
}

export enum NotificationCategory {
  LIKED = 'LIKED',
  COMMENT = 'COMMENT',
  FOLLOW = 'FOLLOW'
}

export const NotificationTypeValues = $enum(NotificationType).map(key => NotificationType[key]);

export const NotificationCategoryValues = $enum(NotificationCategory).map(key => NotificationCategory[key]);
