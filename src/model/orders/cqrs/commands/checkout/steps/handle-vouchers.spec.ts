import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, Voucher } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { mockLogger } from 'src/utils/testing/logger.mock';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { HandleVouchersOrder } from './handle-vouchers';
import {
  dummyOrder,
  dummyVoucher,
} from 'src/utils/testing/helpers/test.helpers';
import { OrderInputDto } from 'src/model/orders/dto/checkout.dto';
import { NotFoundException } from 'src/exceptions';

describe('HandleVouchersOrder', () => {
  let service: HandleVouchersOrder;

  const mockPrisma: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HandleVouchersOrder,
        { provide: PinoLogger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<HandleVouchersOrder>(HandleVouchersOrder);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    const dummyVouchers: Voucher[] = [
      {
        ...dummyVoucher,
        id: 'dummy-id-1',
        endDate: new Date('2030-01-01T00:00:00Z'),
      },
      {
        ...dummyVoucher,
        id: 'dummy-id-2',
        endDate: new Date('2030-01-01T00:00:00Z'),
      },
    ];

    const dummyOrderInput: OrderInputDto = {
      ...dummyOrder,
      voucherIds: dummyVouchers.map((v) => v.id),
    };

    it('should validate vouchers', async () => {
      mockPrisma.voucher.findMany.mockResolvedValueOnce(dummyVouchers);

      const result = service.validate(mockPrisma, dummyOrderInput);

      await expect(result).resolves.toEqual(dummyVouchers);
      expect(mockLogger.trace).toHaveBeenCalledTimes(4);
    });

    it('should throw empty array if vouchersIds is impty', async () => {
      const dummyOrderInput: OrderInputDto = {
        ...dummyOrder,
        voucherIds: [],
      };

      const result = service.validate(mockPrisma, dummyOrderInput);

      await expect(result).resolves.toEqual([]);
      expect(mockLogger.trace).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException if vouchers is not found', async () => {
      mockPrisma.voucher.findMany.mockResolvedValue(dummyVouchers.slice(0, 1));

      const result = service.validate(mockPrisma, dummyOrderInput);

      await expect(result).rejects.toThrow(NotFoundException);
      expect(mockLogger.trace).toHaveBeenCalledTimes(2);
      expect(mockLogger.error).toHaveBeenCalledTimes(1);
    });

    it('should throw ConflictException if voucher is expired', async () => {
      const dummyVouchers: Voucher[] = [
        {
          ...dummyVoucher,
          id: 'dummy-id-1',
          endDate: new Date('2026-01-01T00:00:00Z'),
        },
        {
          ...dummyVoucher,
          id: 'dummy-id-2',
          endDate: new Date('2020-01-01T00:00:00Z'),
        },
      ];
      mockPrisma.voucher.findMany.mockResolvedValue(dummyVouchers.slice(0, 1));

      const result = service.validate(mockPrisma, dummyOrderInput);

      await expect(result).rejects.toThrow(NotFoundException);
      expect(mockLogger.trace).toHaveBeenCalledTimes(2);
      expect(mockLogger.error).toHaveBeenCalledTimes(1);
    });
  });
});
