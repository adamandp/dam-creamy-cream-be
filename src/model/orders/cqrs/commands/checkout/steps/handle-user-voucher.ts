import { ConflictException, Injectable } from '@nestjs/common';
import {
  Prisma,
  UserVoucher,
  UserVoucherStatus,
} from 'src/generated/prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { NotFoundException } from 'src/exceptions';
import { OrderInputDto } from 'src/model/orders/dto/checkout.dto';

@Injectable()
export class HandleUserVouchersOrder {
  constructor(private readonly logger: PinoLogger) {
    this.logger.setContext(HandleUserVouchersOrder.name);
  }

  async validate(
    tx: Prisma.TransactionClient,
    userId: string,
    order: OrderInputDto,
  ): Promise<UserVoucher[] | []> {
    const method = 'validate';
    const voucherIds = order.voucherIds ?? [];

    this.logger.trace({
      method,
      message: `Starting user voucher validation`,
    });

    if (!voucherIds.length) {
      this.logger.trace({
        method,
        message: '🫡 No vouchers applied, skipping validation',
      });
      return [];
    }

    const userVouchersData = await tx.userVoucher.findMany({
      where: {
        userId,
        voucherId: { in: voucherIds },
      },
    });

    const now = new Date();

    for (const id of voucherIds) {
      const userVoucher = userVouchersData.find((v) => v.voucherId === id);

      if (!userVoucher) {
        this.logger.error({
          method,
          type: 'unauthorized-voucher',
          message: `🔒 User ${userId} has no access to voucher ${id}`,
        });
        throw new NotFoundException(`Voucher isn't linked to your account 😶‍🌫️`);
      }

      if (userVoucher.status !== UserVoucherStatus.CLAIMED) {
        this.logger.trace({
          method,
          type: 'voucher-already-used',
          message: `💥 Voucher ${id} already used or unclaimable (user: ${userId})`,
        });
        throw new ConflictException(`Voucher ${id} can't be used anymore 😵`);
      }

      if (userVoucher.expiredAt < now) {
        this.logger.trace({
          method,
          type: 'user-voucher-expired',
          message: `⏰ Voucher "${id}" expired `,
        });
        throw new ConflictException(`"${id}" is already expired 😬`);
      }

      this.logger.trace({
        method,
        status: 'success',
        message: `✅ Voucher ${id} validated for user`,
      });
    }

    this.logger.trace({
      method,
      status: 'success',
      message: `All vouchers validated successfully`,
    });

    return userVouchersData;
  }

  async update(
    tx: Prisma.TransactionClient,
    userVouchersData: UserVoucher[] | [],
  ): Promise<void> {
    const method = 'updateUserVouchers';
    const voucherIds = userVouchersData.map((v) => v.voucherId);

    this.logger.trace({
      method,
      message: `Starting update voucher `,
    });

    if (!userVouchersData.length) {
      this.logger.trace({
        method,
        message: '🫡 No vouchers applied, skipping update',
      });
      return;
    }

    for (const id of voucherIds) {
      const userVoucher = userVouchersData.find((v) => v.voucherId === id);

      await tx.userVoucher.update({
        where: { id: userVoucher!.id },
        data: { status: UserVoucherStatus.USED },
      });

      this.logger.trace({
        method,
        status: 'success',
        message: `✅ Voucher ${id} updated`,
      });
    }

    this.logger.trace({
      method,
      status: 'success',
      message: `All vouchers updated`,
    });
  }
}
