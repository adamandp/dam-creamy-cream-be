import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { PinoLogger } from 'nestjs-pino';
import { mockLogger } from 'src/utils/testing/logger.mock';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { HandleVouchersOrder } from './handle-vouchers';

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
    it('should validate user vouchers', async () => {
      // mockPrisma.$queryRaw.mockResolvedValueOnce(dummyUserVouchers);
      // const result = service.validate(
      //   mockPrisma,
      //   dummyUser.id,
      //   dummyOrderInput,
      // );
      // await expect(result).resolves.toEqual(dummyUserVouchers);
      // expect(mockLogger.trace).toHaveBeenCalledTimes(4);
    });
  });
});
