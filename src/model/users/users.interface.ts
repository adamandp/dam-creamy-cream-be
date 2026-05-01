import z from 'zod';
import { BaseUserSchema } from './users.validation';

type BaseUserDto = z.infer<typeof BaseUserSchema>;

export type ValidateUserResDto = Omit<BaseUserDto, 'password'>;
export type FindAllUserResDto = Omit<BaseUserDto, 'password'>[];
export type FindProfileUserDto = Omit<
  BaseUserDto,
  'id' | 'roleId' | 'password' | 'isActive' | 'createdAt' | 'updatedAt'
>;
export type FindDetailResDto = Pick<
  BaseUserDto,
  'id' | 'roleId' | 'password' | 'username'
>;
export type FindOneUserDto = Omit<BaseUserDto, 'password'>;

export interface JwtPayload {
  sub: string;
  role: string;
}
