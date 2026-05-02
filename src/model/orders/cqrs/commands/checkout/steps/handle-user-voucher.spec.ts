import { Test, TestingModule } from '@nestjs/testing';
import {
  PrismaClient,
  UserVoucher,
  UserVoucherStatus,
  Voucher,
} from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { mockLogger } from 'src/utils/testing/logger.mock';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import {
  dummyOrder,
  dummyUser,
  dummyUserVoucher,
  dummyVoucher,
} from 'src/utils/testing/helpers/test.helpers';
import { HandleUserVouchersOrder } from './handle-user-voucher';
import { NotFoundException } from 'src/exceptions';
import { ConflictException } from '@nestjs/common';
import { OrderInputDto } from 'src/model/orders/dto/checkout.dto';

describe('HandleUserVouchersOrder', () => {
  let service: HandleUserVouchersOrder;

  const mockPrisma: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HandleUserVouchersOrder,
        { provide: PinoLogger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<HandleUserVouchersOrder>(HandleUserVouchersOrder);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    const dummyUserVouchers: UserVoucher[] = [
      {
        ...dummyUserVoucher,
        id: 'dummy-id-1',
        voucherId: 'dummy-voucher-id-1',
      },
      {
        ...dummyUserVoucher,
        id: 'dummy-id-2',
        voucherId: 'dummy-voucher-id-2',
      },
    ];

    const dummyVouchers: Voucher[] = [
      {
        ...dummyVoucher,
        id: 'dummy-voucher-id-1',
        endDate: new Date('2030-01-01T00:00:00Z'),
      },
      {
        ...dummyVoucher,
        id: 'dummy-voucher-id-2',
        endDate: new Date('2030-01-01T00:00:00Z'),
      },
    ];

    const dummyOrderInput: OrderInputDto = {
      ...dummyOrder,
      voucherIds: dummyVouchers.map((v) => v.id),
    };

    it('should validate user vouchers', async () => {
      mockPrisma.userVoucher.findMany.mockResolvedValueOnce(dummyUserVouchers);

      const result = service.validate(
        mockPrisma,
        dummyUser.id,
        dummyOrderInput,
      );

      await expect(result).resolves.toEqual(dummyUserVouchers);
      expect(mockLogger.trace).toHaveBeenCalledTimes(4);
    });

    it('should throw empty array if user vouchers is empty', async () => {
      const result = service.validate(mockPrisma, dummyUser.id, {
        ...dummyOrderInput,
        voucherIds: [],
      });

      await expect(result).resolves.toEqual([]);
      expect(mockLogger.trace).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException if vouchers is not found', async () => {
      mockPrisma.userVoucher.findMany.mockResolvedValue(
        dummyUserVouchers.slice(0, 1),
      );

      const result = service.validate(
        mockPrisma,
        dummyUser.id,
        dummyOrderInput,
      );

      await expect(result).rejects.toThrow(NotFoundException);
      expect(mockLogger.trace).toHaveBeenCalledTimes(2);
      expect(mockLogger.error).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException if user voucher is used', async () => {
      const dummyUserVouchers: UserVoucher[] = [
        {
          ...dummyUserVoucher,
          id: 'dummy-id-1',
          voucherId: 'dummy-voucher-id-1',
        },
        {
          ...dummyUserVoucher,
          id: 'dummy-id-2',
          voucherId: 'dummy-voucher-id-2',
          status: UserVoucherStatus.USED,
        },
      ];

      mockPrisma.userVoucher.findMany.mockResolvedValue(dummyUserVouchers);

      const result = service.validate(
        mockPrisma,
        dummyUser.id,
        dummyOrderInput,
      );

      await expect(result).rejects.toThrow(ConflictException);
      expect(mockLogger.trace).toHaveBeenCalledTimes(3);
    });

    it('should throw ConflictException if user voucher is expired', async () => {
      const dummyUserVouchers: UserVoucher[] = [
        {
          ...dummyUserVoucher,
          id: 'dummy-id-1',
          voucherId: 'dummy-voucher-id-1',
        },
        {
          ...dummyUserVoucher,
          id: 'dummy-id-2',
          voucherId: 'dummy-voucher-id-2',
          expiredAt: new Date('2020-01-01T00:00:00Z'),
        },
      ];

      mockPrisma.userVoucher.findMany.mockResolvedValue(dummyUserVouchers);

      const result = service.validate(
        mockPrisma,
        dummyUser.id,
        dummyOrderInput,
      );

      await expect(result).rejects.toThrow(ConflictException);
      expect(mockLogger.trace).toHaveBeenCalledTimes(3);
    });
  });
});
