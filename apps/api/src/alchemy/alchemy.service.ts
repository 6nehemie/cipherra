import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import {
  Alchemy,
  BigNumber,
  Block,
  BlockWithTransactions,
  TransactionResponse,
} from 'alchemy-sdk';

@Injectable()
export class AlchemyService {
  constructor(@Inject('ALCHEMY') private readonly alchemy: Alchemy) {}

  /**
   * Retrieves the block information for the given block number.
   *
   * @param {number} blockNumber - The block number to retrieve information for.
   * @returns {Promise<any>} - A promise that resolves to the block information.
   * @throws {InternalServerErrorException} - If an error occurs while retrieving the block information.
   */
  async getBlock(blockNumber: number): Promise<Block> {
    try {
      return await this.alchemy.core.getBlock(blockNumber);
    } catch (error) {
      console.error('Error', error);
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Retrieves the block information for the given block number along with the transactions.
   *
   * @param {number} blockNumber - The block number to retrieve information for.
   * @returns {Promise<any>} - A promise that resolves to the block information with transactions.
   * @throws {InternalServerErrorException} - If an error occurs while retrieving the block information.
   */
  async getBlockWithTransactions(
    blockNumber: number,
  ): Promise<BlockWithTransactions> {
    try {
      return await this.alchemy.core.getBlockWithTransactions(blockNumber);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Retrieves the balances of addresses involved in the transactions of a given block.
   *
   * @param {number} blockNumber - The block number to retrieve balances for.
   * @param {TransactionResponse[]} transactions - The list of transactions to retrieve balances for.
   * @returns {Promise<Map<string, BigNumber>>} - A promise that resolves to a map of addresses to their balances.
   * @throws {InternalServerErrorException} - If an error occurs while retrieving the balances.
   */
  async getBalances(
    blockNumber: number,
    transactions: TransactionResponse[],
  ): Promise<Map<string, BigNumber>> {
    const balances: Map<string, BigNumber> = new Map();

    try {
      const promiseArray = transactions.map((transaction) =>
        this.getBalance(blockNumber, transaction.from),
      );

      // Await all promises at once
      const balancesArray = await Promise.all(promiseArray);

      transactions.forEach((transaction, index) => {
        const balance = balancesArray[index];

        if (balance) {
          balances.set(transaction.from, balance);
        } else {
          balances.set(transaction.from, null);
        }
      });

      return balances || new Map();
    } catch (error) {
      console.error('Error fetching balances:', error);
      throw new InternalServerErrorException('Failed to retrieve balances');
    }
  }

  /**
   * Retrieves the balance of a given address at a specific block number.
   *
   * @param {number} blockNumber - The block number to retrieve the balance for.
   * @param {string} address - The address to retrieve the balance for.
   * @returns {Promise<BigNumber>} - A promise that resolves to the balance of the address.
   * @throws {InternalServerErrorException} - If an error occurs while retrieving the balance.
   */
  async getBalance(blockNumber: number, address: string): Promise<BigNumber> {
    try {
      const balance = await this.alchemy.core.getBalance(address, blockNumber);

      return balance;
    } catch {
      return {
        _hex: null,
      } as BigNumber;
    }
  }
}
