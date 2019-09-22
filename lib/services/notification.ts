import { request } from '@lib/common/utils/request';
import { NotificationEntity } from '@lib/common/interfaces/notification';

export const getNotificationList = async () => (
  request.get<NotificationEntity[]>('/api/notification')
);
