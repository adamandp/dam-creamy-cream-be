import z from 'zod';
import { BaseOrderItemSchema, BaseOrderSchema } from '../orders.validation';
import { createZodDto } from 'nestjs-zod';
import { BaseShipmentSchema } from 'src/model/shipments/shipments.validation';
import { BasePaymentSchema } from 'src/model/payments/payments.validation';
import { baseUUID } from 'src/utils/zod.helper';

const OrderInputSchema = BaseOrderSchema.pick({
  userId: true,
  addressId: true,
}).extend({
  voucherIds: z
    .array(baseUUID('Voucher ID'))
    .max(2, { message: 'Voucher ID max 2' })
    .nullish(),
});

const OrderItemInputSchema = BaseOrderItemSchema.pick({
  productId: true,
  discountId: true,
  quantity: true,
})
  .array()
  .min(1);

const ShipmentInputSchema = BaseShipmentSchema.pick({
  courier: true,
  service: true,
  cost: true,
  estimated: true,
  description: true,
});

const PaymentInputSchema = BasePaymentSchema.pick({
  method: true,
});

const CreateOrderSchema = z.object({
  order: OrderInputSchema,
  orderItems: OrderItemInputSchema,
  shipment: ShipmentInputSchema,
  payment: PaymentInputSchema,
});

class CheckOutDto
  extends createZodDto(CreateOrderSchema)
  implements z.infer<typeof CreateOrderSchema> {}

class OrderInputDto
  extends createZodDto(OrderInputSchema)
  implements z.infer<typeof OrderInputSchema> {}

class OrderItemInputDto
  extends createZodDto(OrderItemInputSchema)
  implements z.infer<typeof OrderItemInputSchema> {}

class ShipmentInputDto
  extends createZodDto(ShipmentInputSchema)
  implements z.infer<typeof ShipmentInputSchema> {}

class PaymentInputDto
  extends createZodDto(PaymentInputSchema)
  implements z.infer<typeof PaymentInputSchema> {}

export {
  CheckOutDto,
  OrderInputDto,
  OrderItemInputDto,
  ShipmentInputDto,
  PaymentInputDto,
};
