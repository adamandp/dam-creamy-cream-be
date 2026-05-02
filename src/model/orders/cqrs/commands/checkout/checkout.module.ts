import { Module } from '@nestjs/common';
import { CheckoutOrderHandler } from './checkout.handler';
import {
  HandleUserOrder,
  HandleAddressOrder,
  HandleProductsOrder,
  HandleCartOrder,
  HandleVouchersOrder,
  HandleUserVouchersOrder,
  HandleDicountsOrder,
  HandleInventoriesOrder,
  HandleCartItemsOrder,
  HandleProductsDiscountOrder,
  HandleMappingOrder,
  HandleCalculationOrder,
  HandleOrderItems,
  HandleOrderVouchers,
  HandlePaymentOrder,
  HandleOrder,
  HandleShipmentOrder,
} from './steps/index';

@Module({
  providers: [
    CheckoutOrderHandler,
    HandleUserOrder,
    HandleAddressOrder,
    HandleProductsOrder,
    HandleCartOrder,
    HandleVouchersOrder,
    HandleUserVouchersOrder,
    HandleDicountsOrder,
    HandleInventoriesOrder,
    HandleCartItemsOrder,
    HandleProductsDiscountOrder,
    HandleMappingOrder,
    HandleCalculationOrder,
    HandleOrder,
    HandleOrderItems,
    HandleOrderVouchers,
    HandlePaymentOrder,
    HandleShipmentOrder,
  ],
  exports: [CheckoutOrderHandler],
})
export class CheckoutOrderModule {}
