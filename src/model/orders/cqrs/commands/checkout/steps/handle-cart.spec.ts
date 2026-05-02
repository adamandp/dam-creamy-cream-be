import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { mockLogger } from 'src/utils/testing/logger.mock';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { NotFoundException } from 'src/exceptions';
import { dummyCart } from 'src/utils/testing/helpers/test.helpers';
import { HandleCartOrder } from './handle-cart';

describe('HandleCartOrder', () => {
  let service: HandleCartOrder;

  const mockPrisma: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HandleCartOrder,
        { provide: PinoLogger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<HandleCartOrder>(HandleCartOrder);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should validate cart', async () => {
      mockPrisma.cart.findUniqueOrThrow.mockResolvedValueOnce(dummyCart);

      const result = service.validate(mockPrisma, dummyCart.id);

      await expect(result).resolves.toEqual(dummyCart.id);
      expect(mockLogger.trace).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException if cart is not found', async () => {
      mockPrisma.cart.findUniqueOrThrow.mockRejectedValueOnce(
        new NotFoundException('Cart'),
      );

      const result = service.validate(mockPrisma, dummyCart.id);

      await expect(result).rejects.toThrow(NotFoundException);
      expect(mockLogger.trace).toHaveBeenCalledTimes(1);
    });
  });
});
