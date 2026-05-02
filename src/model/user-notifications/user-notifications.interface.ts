import z from 'zod';
import { BaseUserNotificationSchema } from './user-notifications.validation';
import { BaseNotificationsDto } from '../notifications/notifications.interface';

type BaseUserNotificationDto = z.infer<typeof BaseUserNotificationSchema>;

type ValidateUserNotificationDto = BaseUserNotificationDto;
type FindByIdUserNotificationDto = BaseUserNotificationDto & {
  notifications: BaseNotificationsDto;
};
type FindAllUserNotificationDto = BaseUserNotificationDto[];
type FindByUserUserNotificationDto = FindByIdUserNotificationDto[];
type FindByNotifiactionUserNotificationDto = FindByIdUserNotificationDto[];
type FindByUserCountUserNotificationDto = { count: number };
type FindByNotifiactionCountUserNotificationDto = { count: number };

export type {
  ValidateUserNotificationDto,
  FindAllUserNotificationDto,
  FindByIdUserNotificationDto,
  FindByUserUserNotificationDto,
  FindByNotifiactionUserNotificationDto,
  FindByUserCountUserNotificationDto,
  FindByNotifiactionCountUserNotificationDto,
};
