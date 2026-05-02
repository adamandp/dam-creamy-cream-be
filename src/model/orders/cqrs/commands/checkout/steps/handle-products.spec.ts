import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient, Product } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { mockLogger } from 'src/utils/testing/logger.mock';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { NotFoundException } from 'src/exceptions';
import { HandleProductsOrder } from './handle-products';
import { dummyProduct } from 'src/utils/testing/helpers/test.helpers';
import { OrderItemInputDto } from 'src/model/orders/dto/checkout.dto';

describe('HandleProductsOrder', () => {
  let service: HandleProductsOrder;

  const mockPrisma: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HandleProductsOrder,
        { provide: PinoLogger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<HandleProductsOrder>(HandleProductsOrder);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    const dummyProducts: Product[] = [
      {
        ...dummyProduct,
      },
      {
        ...dummyProduct,
        id: 'dummy-uuid-2',
      },
    ];

    const dummyOrderItems: OrderItemInputDto = [
      {
        productId: dummyProducts[0].id,
        quantity: 1,
      },
      {
        productId: dummyProducts[1].id,
        quantity: 1,
      },
    ];

    it('should validate products order', async () => {
      mockPrisma.product.findMany.mockResolvedValueOnce(dummyProducts);

      const result = service.validate(mockPrisma, dummyOrderItems);

      await expect(result).resolves.toEqual(dummyProducts);
      expect(mockLogger.trace).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException if product is not found', async () => {
      mockPrisma.product.findMany.mockResolvedValueOnce(dummyProducts.slice(1));

      const result = service.validate(mockPrisma, dummyOrderItems);

      await expect(result).rejects.toThrow(NotFoundException);
      expect(mockLogger.trace).toHaveBeenCalledTimes(1);
      expect(mockLogger.error).toHaveBeenCalledTimes(1);
    });
  });
});
