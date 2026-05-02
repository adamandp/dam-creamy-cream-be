import { Test, TestingModule } from '@nestjs/testing';
import { DiscountType, PrismaClient } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { mockLogger } from 'src/utils/testing/logger.mock';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { MappedOrderItem } from 'src/model/orders/orders.interface';
import { HandleCalculationOrder } from './handle-calculate';

describe('HandleCalculationOrder', () => {
  let service: HandleCalculationOrder;

  const mockPrisma: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HandleCalculationOrder,
        { provide: PinoLogger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<HandleCalculationOrder>(HandleCalculationOrder);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    const dummyMappedOrderItems: MappedOrderItem[] = [
      {
        id: 'dummy-id',
        quantity: 1,
        price: 20_000,
        discountId: 'dummy-discount_id',
        finalPrice: 15_000,
        discountAmount: 5_000,
        discountType: DiscountType.FIXED,
        discountValue: 5_000,
      },
      {
        id: 'dummy-id',
        quantity: 2,
        price: 30_000,
        discountId: 'dummy-discount_id',
        discountValue: 20,
        discountType: DiscountType.PERCENTAGE,
        discountAmount: 6_000,
        finalPrice: 24_000,
      },
      {
        id: 'dummy-id',
        quantity: 2,
        price: 40_000,
        discountId: 'dummy-discount_id',
        discountValue: 1,
        discountType: DiscountType.PRICE,
        discountAmount: 39_999,
        finalPrice: 1,
      },
      {
        id: 'dummy-id',
        quantity: 1,
        price: 45_000,
        discountId: 'dummy-discount_id',
        discountValue: 0,
        discountType: DiscountType.FREE_ITEM,
        discountAmount: 0,
        finalPrice: 45_000,
      },
    ];

    it('should calculate order items', () => {
      const result = service.calculateOrderItems(dummyMappedOrderItems);

      expect(result).toEqual({
        totalPrice: 20_000 * 2 + 30_000 * 2 + 40_000 * 2 + 45_000,
        totalFinalPrice: 63_000,
        totalDiscount: 5_000 * 1 + 6_000 * 2 + 39_999 * 2,
      });
    });
  });
});
