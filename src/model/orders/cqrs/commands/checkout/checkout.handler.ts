import { Injectable } from '@nestjs/common';
import { PinoLogger } from 'nestjs-pino';
import { PrismaService } from 'src/common/prisma.module';
import { Messages } from 'src/utils/message.helper';
import { WebResponse } from 'src/common/common.interface';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CheckOutCommand } from './checkout.command';
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

@Injectable()
@CommandHandler(CheckOutCommand)
export class CheckoutOrderHandler implements ICommandHandler<CheckOutCommand> {
  constructor(
    private readonly logger: PinoLogger,
    private readonly prisma: PrismaService,
    private readonly handleUser: HandleUserOrder,
    private readonly handleAddress: HandleAddressOrder,
    private readonly handleProducts: HandleProductsOrder,
    private readonly handleCart: HandleCartOrder,
    private readonly handleVouchers: HandleVouchersOrder,
    private readonly handleUserVouchers: HandleUserVouchersOrder,
    private readonly handleDiscounts: HandleDicountsOrder,
    private readonly handleInventories: HandleInventoriesOrder,
    private readonly handleCartItems: HandleCartItemsOrder,
    private readonly handleProductDiscounts: HandleProductsDiscountOrder,
    private readonly handleMappingOrder: HandleMappingOrder,
    private readonly handleCalculation: HandleCalculationOrder,
    private readonly handleOrder: HandleOrder,
    private readonly handleOrderItems: HandleOrderItems,
    private readonly handleOrderVouchers: HandleOrderVouchers,
    private readonly handlePayment: HandlePaymentOrder,
    private readonly handleShipment: HandleShipmentOrder,
  ) {
    this.logger.setContext(CheckoutOrderHandler.name);
  }

  private name = 'Order';

  async execute(command: CheckOutCommand): Promise<WebResponse> {
    const { order, orderItems, payment, shipment } = command.payload;
    const { userId } = order;
    const { cost, ...shipmentInput } = shipment;

    await this.prisma.$transaction(
      async (tx) => {
        // validation
        await this.handleUser.validate(tx, userId);
        await this.handleAddress.validate(tx, order);
        const products = await this.handleProducts.validate(tx, orderItems);
        const cartId = await this.handleCart.validate(tx, userId);
        const vouchers = await this.handleVouchers.validate(tx, order);
        const userVouchers = await this.handleUserVouchers.validate(
          tx,
          userId,
          order,
        );
        const discounts = await this.handleDiscounts.validateAndLock(
          tx,
          orderItems,
        );

        await this.handleInventories.validateAndLock(tx, orderItems);
        await this.handleCartItems.validateAndLock(tx, cartId, orderItems);
        await this.handleProductDiscounts.validate(tx, orderItems);

        // updating
        await this.handleInventories.update(tx, orderItems);
        await this.handleDiscounts.update(tx, orderItems);
        await this.handleCartItems.update(tx, cartId, orderItems);
        await this.handleUserVouchers.update(tx, userVouchers);

        // calculating
        const mappedOrderItem = this.handleMappingOrder.mapOrderItems(
          products,
          discounts,
          orderItems,
        );
        const { totalDiscount, totalPrice, totalFinalPrice } =
          this.handleCalculation.calculateOrderItems(mappedOrderItem);
        const shippingCost = this.handleCalculation.calculateShippingVouchers(
          vouchers,
          cost,
        );
        shipment.cost = shippingCost;
        const finalPrice = this.handleCalculation.calculateCheckoutVouchers(
          vouchers,
          totalFinalPrice,
        );
        const orderPrice = finalPrice + shippingCost;

        // creating
        const orderId = await this.handleOrder.create(
          tx,
          userId,
          order,
          totalDiscount,
          totalPrice,
          orderPrice,
        );
        await this.handleOrderItems.create(tx, mappedOrderItem, orderId);
        await this.handleOrderItems.createFromFreeItemVouchers(
          tx,
          orderId,
          vouchers,
        );
        await this.handleOrderItems.createFromFreeItemDiscounts(
          tx,
          orderId,
          discounts,
        );
        await this.handleOrderVouchers.create(tx, orderId, order);
        await this.handlePayment.create(tx, orderId, payment, orderPrice);
        await this.handleShipment.create(
          tx,
          orderId,
          shipmentInput,
          shippingCost,
        );
      },
      {
        timeout: 5000,
      },
    );
    return {
      message: Messages.create(this.name),
    };
  }
}
