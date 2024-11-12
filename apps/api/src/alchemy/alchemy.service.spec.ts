import { Test, TestingModule } from '@nestjs/testing';

import { blockWithTransaction } from '../utils/test-data/blockWithTransaction';
import { AlchemyService } from './alchemy.service';
import { InternalServerErrorException } from '@nestjs/common';
import { generic } from '../utils/generic';

describe('AlchemyService', () => {
  let alchemyService: AlchemyService;

  // Mock the AlchemyService methods
  const fakeAlchemyService: Partial<Record<keyof AlchemyService, jest.Mock>> = {
    getBlock: jest.fn(),
    getBalances: jest.fn(),
    getBlockWithTransactions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AlchemyService,
          useValue: fakeAlchemyService,
        },
      ],
    }).compile();

    alchemyService = module.get<AlchemyService>(AlchemyService);
  });

  it('should be defined', () => {
    expect(alchemyService).toBeDefined();
  });

  describe('getBlockWithTransactions', () => {
    it('should return the block with transactions if it exists', async () => {
      // Set up the mock's return value for a valid block number
      fakeAlchemyService.getBlockWithTransactions.mockResolvedValueOnce(
        blockWithTransaction,
      );

      const blockNumber = blockWithTransaction.number;
      const block = await alchemyService.getBlockWithTransactions(blockNumber);

      expect(fakeAlchemyService.getBlockWithTransactions).toHaveBeenCalledWith(
        blockNumber,
      );
      expect(block).toEqual(blockWithTransaction);
    });

    it('should throw an error if the block does not exist', async () => {
      // Set up the mock to throw an error for an invalid block number
      fakeAlchemyService.getBlockWithTransactions.mockRejectedValueOnce(
        new InternalServerErrorException(generic.INTERNAL_SERVER_ERROR),
      );

      const blockNumber = 0;

      await expect(
        alchemyService.getBlockWithTransactions(blockNumber),
      ).rejects.toThrow(InternalServerErrorException);
      expect(fakeAlchemyService.getBlockWithTransactions).toHaveBeenCalledWith(
        blockNumber,
      );
    });
  });
});
