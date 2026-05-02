import { Test, TestingModule } from '@nestjs/testing';
import { HandleUserOrder } from './handle-user';
import { PrismaClient } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { mockLogger } from 'src/utils/testing/logger.mock';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { NotFoundException } from 'src/exceptions';
import { dummyUser } from 'src/utils/testing/helpers/test.helpers';

describe('HandleUserOrder', () => {
  let service: HandleUserOrder;

  const mockPrisma: DeepMockProxy<PrismaClient> = mockDeep<PrismaClient>();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HandleUserOrder,
        { provide: PinoLogger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<HandleUserOrder>(HandleUserOrder);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validate', () => {
    it('should validate user', async () => {
      mockPrisma.user.findUniqueOrThrow.mockResolvedValueOnce(dummyUser);

      const result = service.validate(mockPrisma, dummyUser.id);

      await expect(result).resolves.toBeUndefined();
      expect(mockLogger.trace).toHaveBeenCalledTimes(2);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockPrisma.user.findUniqueOrThrow.mockRejectedValueOnce(
        new NotFoundException('User'),
      );

      const result = service.validate(mockPrisma, dummyUser.id);

      await expect(result).rejects.toThrow(NotFoundException);
      expect(mockLogger.trace).toHaveBeenCalledTimes(1);
    });
  });
});
