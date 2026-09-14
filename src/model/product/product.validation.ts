// product-information.schema.ts

import { z } from 'zod';

export const ProductDetailsSchema = z.object({
  size: z.string(),
  storage: z.string(),
  shelfLife: z.string(),
});

export const ProductInformationSchema = z.object({
  highlights: z.array(z.string()),
  servingSuggestions: z.array(z.string()),
  productDetails: ProductDetailsSchema,
});

export type ProductDetails = z.infer<typeof ProductDetailsSchema>;
export type ProductInformation = z.infer<typeof ProductInformationSchema>;
