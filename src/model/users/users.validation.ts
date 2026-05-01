import { regex } from 'src/utils/regex';
import {
  baseName,
  baseUUID,
  stringMinMax,
  baseBoolean,
  baseDate,
  baseEnum,
} from 'src/utils/zod.helper';
import z from 'zod';

export const BaseUserSchema = z
  .object({
    id: baseUUID('User ID'),
    roleId: baseUUID('Role ID'),
    username: baseName('Username', 5, 50),
    email: stringMinMax('Email', 4, 100)
      .email({
        message: `📧 Invalid email format! Try something like user@example.com ✉️ {Invalid Email}`,
      })
      .nullish(),
    phoneNumber: stringMinMax('Phone number', 4, 100)
      .regex(regex.phone, {
        message: `📞 Invalid phone number! Double-check and try again! 🤳 {Invalid Phone}`,
      })
      .nullish(),
    password: stringMinMax('Password', 8, 255)
      .regex(/[a-z]/, {
        message: `🔠 Password must include at least one lowercase letter (a-z). Don't forget! ✏️ {Lowercase Letter Required}`,
      })
      .regex(/[A-Z]/, {
        message: `🔡 Password must include at least one uppercase letter (A-Z). Level up! 🔝 {Uppercase Letter Required}`,
      })
      .regex(/\d/, {
        message: `🔢 Password must include at least one number (0-9). Add some digits! 📈 {Number Required}`,
      })
      .regex(/[!@#$%^&*]/, {
        message: `🔒 Password must include a special character (!@#$%^&*). Stay secure! 🛡️ {Special Character Required}`,
      }),
    fullName: stringMinMax('Full Name', 1, 100),
    birthDate: baseDate('Birth Date').nullish(),
    imageUrl: stringMinMax('Image URL', 1, 255)
      .regex(regex.imageUrl, {
        message: `🌍 Image URL must be a valid URL. Where are you trying to go? 🚀 {Invalid URL}`,
      })
      .nullish(),
    gender: baseEnum('Gender', ['OTHER', 'MAN', 'WOMAN']).nullish(),
    isActive: baseBoolean('Is Active'),
    updatedAt: baseDate('Updated At'),
    createdAt: baseDate('Created At'),
  })
  .strict();
