import z from 'zod';
import { BaseNotificationsSchema } from './notifications.validation';

type BaseNotificationsDto = z.infer<typeof BaseNotificationsSchema>;
type ValidateNotificationDto = BaseNotificationsDto;
type FindByIdNotificationDto = BaseNotificationsDto;
type FindAllNotificationsDto = BaseNotificationsDto[];

export type {
  BaseNotificationsDto,
  ValidateNotificationDto,
  FindByIdNotificationDto,
  FindAllNotificationsDto,
};
