import { regex } from 'src/utils/regex';
import {
  baseBoolean,
  baseDate,
  baseNumber,
  baseUUID,
  stringMinMax,
} from 'src/utils/zod.helper';
import z from 'zod';

export const BaseProductSchema = z
  .object({
    id: baseUUID('Product ID'),
    categoryId: baseUUID('Category ID'),
    discountId: baseUUID('Category ID').nullish(),
    name: stringMinMax('Name', 1, 100),
    imageUrl: stringMinMax('Image URL', 1, 255)
      .regex(regex.imageUrl, {
        message: `🌍 Image URL must be a valid URL. Where are you trying to go? 🚀 {Invalid URL}`,
      })
      .nullish(),
    description: stringMinMax('Description', 1, 255).nullable(),
    price: baseNumber('price')
      .min(
        1000,
        `💰 price must be at least Rp1.000. Don't be cheap! 🤑 {Price Too Low}`,
      )
      .max(
        1000000,
        `💰 price must be less than Rp1,000,000. Don't be greedy! 🤑 {Price Too High}`,
      ),
    isActive: baseBoolean('Is Active'),
    updatedAt: baseDate('Updated At'),
    createdAt: baseDate('Created At'),
  })
  .strict();
