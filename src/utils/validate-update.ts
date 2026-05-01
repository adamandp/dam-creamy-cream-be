import { BadRequestException } from '@nestjs/common';

export const validateUpdate = <T extends Record<string, any>>(
  newData: T,
  oldData: Partial<{ [K in keyof T]: T[K] | null }>,
) => {
  oldData = oldData ?? {};

  const updatedFields = Object.fromEntries(
    Object.entries(newData).filter(([key, value]) => oldData?.[key] !== value),
  );

  const sameFields = Object.fromEntries(
    Object.entries(newData).filter(([key, value]) => oldData?.[key] === value),
  );

  if (Object.keys(updatedFields).length === 0)
    throw new BadRequestException(
      `📭 No changes detected. Everything is already up to date! 👍`,
    );

  if (Object.keys(sameFields).length > 0)
    throw new BadRequestException(
      `📭 No changes detected in ${Object.keys(sameFields).join(', ')} fields. Everything’s already up to date!`,
    );

  return updatedFields;
};
