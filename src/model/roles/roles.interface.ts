import z from 'zod';
import { BaseRoleSchema } from './roles.validation';

type BaseRoleInterface = z.infer<typeof BaseRoleSchema>;

export type FindOneRoleDto = Omit<BaseRoleInterface, 'createdAt' | 'updatedAt'>;
export type FindAllRoleDto = FindOneRoleDto[];
