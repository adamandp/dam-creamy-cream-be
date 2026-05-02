import z from 'zod';
import { BaseShipmentSchema } from './shipments.validation';

type BaseShipmentDto = z.infer<typeof BaseShipmentSchema>;

type FindAllShipmentDto = BaseShipmentDto[];
type FindByIdShipmentDto = BaseShipmentDto;
type FindManyIdShipmentDto = BaseShipmentDto[];

export type {
  BaseShipmentDto,
  FindAllShipmentDto,
  FindByIdShipmentDto,
  FindManyIdShipmentDto,
};
