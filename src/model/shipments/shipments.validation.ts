import {
  baseDate,
  baseEnum,
  baseNumber,
  baseUUID,
  stringMinMax,
} from 'src/utils/zod.helper';
import z from 'zod';

const ShipmentStatus = [
  'PENDING',
  'SHIPPED',
  'DELIVERED',
  'CANCELLED',
] as const;

export const BaseShipmentSchema = z.object({
  id: baseUUID('Shipment ID'),
  orderId: baseUUID('Order ID'),
  courier: stringMinMax('Courier', 1, 50),
  service: stringMinMax('Service', 1, 50),
  cost: baseNumber('Cost'),
  estimated: baseDate('Estimated'),
  deliveredAt: baseDate('Delivered At').nullable(),
  description: stringMinMax('Description', 1, 255).nullable(),
  trackingNumber: stringMinMax('Tracking Number', 1, 50).nullable(),
  status: baseEnum('Status', ShipmentStatus),
  createdAt: baseDate('Created At'),
  updatedAt: baseDate('Updated At'),
});

export const couriers = [
  { name: 'anteraja' },
  { name: 'dse' },
  { name: 'pos' },
  { name: 'lion' },
  { name: 'ninja' },
  { name: 'ide' },
  { name: 'sicepat' },
  { name: 'sap' },
  { name: 'ncs' },
  { name: 'rex' },
  { name: 'jtl' },
  { name: 'sentral' },
  { name: 'jne' },
  { name: 'tiki' },
  { name: 'rpx' },
  { name: 'pandu' },
  { name: 'wahana' },
  { name: 'jnt' },
  { name: 'slis' },
  { name: 'expedito' },
  { name: 'ray' },
  { name: 'first' },
  { name: 'star' },
];

const ewallet = [{ name: 'Gopay' }, { name: 'Qris' }, { name: 'Shopee Pay' }];

const otc = [{ name: 'Alfamart' }, { name: 'Indomaret' }];

const bank = [
  { name: 'BCA' },
  { name: 'BNI' },
  { name: 'BRI' },
  { name: 'CIMB' },
  { name: 'Mandiri' },
  { name: 'Permata' },
];

const paymentMethod = [
  { key: 'ewallet', label: 'E-Wallet', data: ewallet },
  { key: 'otc', label: 'OTC', data: otc },
  { key: 'bank', label: 'Bank', data: bank },
];
