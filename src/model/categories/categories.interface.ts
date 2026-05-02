import z from 'zod';
import { BaseCategorySchema } from './categories.validation';

export type BaseCategoryDto = z.infer<typeof BaseCategorySchema>;

export type FindByIdCategoryDto = BaseCategoryDto;
export type FindAllCategoryDto = FindByIdCategoryDto[];
export type ValidateCategoryDto = FindByIdCategoryDto;
