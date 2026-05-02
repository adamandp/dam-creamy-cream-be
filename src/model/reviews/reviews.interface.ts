import z from 'zod';
import { BaseReviewSchema } from './reviews.validation';

type BaseReviewDto = z.infer<typeof BaseReviewSchema>;

export type ValidateReviewResDto = BaseReviewDto;
export type FindAllReviewResDto = BaseReviewDto[];
export type FindByIdReviewResDto = BaseReviewDto;
export type FindByUserReviewResDto = BaseReviewDto[];
export type FindByProductReviewResDto = BaseReviewDto[];
