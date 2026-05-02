import z from 'zod';
import { BaseInventorySchema } from './inventory.validation';

export type BaseInventoryDto = z.infer<typeof BaseInventorySchema>;

export type ValidateInventoryResDto = BaseInventoryDto;
export type findByProductIdInventoryResDto = BaseInventoryDto;
export type findByIdInventoryResDto = BaseInventoryDto;
export type findAllInventoryResDto = BaseInventoryDto[];
