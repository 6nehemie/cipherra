import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AlchemyService } from 'src/alchemy/alchemy.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { DetectionDto } from './dto/detection.dto';

@Injectable()
export class DetectionService {
  constructor(
    private readonly alchemyService: AlchemyService,
    private readonly transactionsService: TransactionsService,
  ) {}

  /**
   * Analyzes the transactions in a given block to detect suspicious activities.
   *
   * @param {number} blockNumber - The block number to analyze.
   * @returns {Promise<DetectionDto>} - A promise that resolves to the detection result.
   * @throws {InternalServerErrorException} - If an error occurs during the analysis.
   */
  async analyze(
    blockNumber: number,
    options?: { checkPriceDrop?: boolean },
  ): Promise<DetectionDto> {
    try {
      //? Retrieve the block information
      const blockWithTransactions =
        await this.alchemyService.getBlockWithTransactions(blockNumber);

      //? Analyze the transactions
      const suspiciousTransactions =
        await this.transactionsService.getSuspiciousTransactions(
          blockWithTransactions,
          options?.checkPriceDrop,
        );

      return {
        blockNumber: blockWithTransactions.number,
        chainId: 1,
        presenceOfAttack: suspiciousTransactions.length > 0,
        attacks: suspiciousTransactions,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
