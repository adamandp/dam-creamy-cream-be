import { regex } from 'src/utils/regex';
import {
  baseDate,
  baseName,
  baseUUID,
  coerceBoolean,
  coerceNumberMinMax,
  stringMinMax,
} from 'src/utils/zod.helper';
import z from 'zod';

export const BaseAddressSchema = z
  .object({
    id: baseUUID('Address ID'),
    userId: baseUUID('User ID'),
    recipientName: baseName('Recipient Name', 1, 100),
    recipientPhoneNumber: stringMinMax('Phone number', 4, 100).regex(
      regex.phone,
      {
        message: `📞 Invalid phone number! Double-check and try again! 🤳 {Invalid Phone}`,
      },
    ),
    province: stringMinMax('Province', 1, 100),
    city: stringMinMax('City', 1, 100),
    subdistrict: stringMinMax('Subdistrict', 1, 100),
    village: stringMinMax('Village', 1, 100),
    postalCode: stringMinMax('Postal Code', 0, 100),
    address: stringMinMax('Address', 1, 100),
    isPrimary: coerceBoolean('Is Primary'),
    updatedAt: baseDate('Updated At'),
    createdAt: baseDate('Created At'),
  })
  .strict();
