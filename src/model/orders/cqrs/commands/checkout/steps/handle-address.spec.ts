import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { mockLogger } from 'src/utils/testing/logger.mock';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { NotFoundException } from 'src/exceptions';
import { HandleAddressOrder } from './handle-address';
import { dummyAddress } from 'src/utils/testing/helpers/test.helpers';
import { dummyCreateOrder } from 'src/utils/testing/helpers/order-test.helpers';

describe('HandleAddressOrder', () => {
  let service: HandleAddressOrder;

  const mockPrisma: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HandleAddressOrder,
        { provide: PinoLogger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<HandleAddressOrder>(HandleAddressOrder);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should validate address', async () => {
      mockPrisma.address.findUniqueOrThrow.mockResolvedValueOnce(dummyAddress);

      const result = service.validate(mockPrisma, dummyCreateOrder.order);

      await expect(result).resolves.toBeUndefined();
      expect(mockLogger.trace).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException if address is not found', async () => {
      mockPrisma.address.findUniqueOrThrow.mockRejectedValue(
        new NotFoundException('Address'),
      );

      const result = service.validate(mockPrisma, dummyCreateOrder.order);

      await expect(result).rejects.toThrow(NotFoundException);
    });
  });
});
