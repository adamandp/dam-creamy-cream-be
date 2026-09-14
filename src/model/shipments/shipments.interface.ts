import z from 'zod';
import { BaseShipmentSchema } from './shipments.validation';

type BaseShipmentDto = z.infer<typeof BaseShipmentSchema>;

type FindAllShipmentDto = BaseShipmentDto[];
type FindByIdShipmentDto = BaseShipmentDto;
type FindManyIdShipmentDto = BaseShipmentDto[];
type ShippingMeta = {
  message: string;
  code: number;
  status: string;
};

type ShippingData = {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
};

type ShippingResponse = {
  meta: ShippingMeta;
  data: ShippingData[];
};

export type {
  BaseShipmentDto,
  FindAllShipmentDto,
  FindByIdShipmentDto,
  FindManyIdShipmentDto,
  ShippingData,
  ShippingResponse,
};
