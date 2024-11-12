import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Severity } from 'types';
import {
  BigNumber,
  BlockWithTransactions,
  TransactionResponse,
} from 'alchemy-sdk';
import { AttackService } from '../attacks/attacks.service';
import { AlchemyService } from '../alchemy/alchemy.service';
import { Attacks } from '../attacks/entities/attacks.entity';
import { AttackDto } from '../detection/dto/attack.dto';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly attackService: AttackService,
    private readonly alchemyService: AlchemyService,
  ) {}

  // * TODO: MAKE THE BALANCE CHECK OPTIONAL

  /**
   * Processes a block of transactions to identify suspicious activities.
   *
   * @param {BlockWithTransactions} blockWithTransactions - The block containing transactions to analyze.
   * @returns {Promise<AttackDto[]>} - A promise that resolves to an array of detected attacks.
   * @throws {InternalServerErrorException} - Throws an error if processing fails.
   */
  async getSuspiciousTransactions(
    blockWithTransactions: BlockWithTransactions,
    checkPriceDrop = false,
  ): Promise<AttackDto[]> {
    const attacks: Set<Attacks> = new Set();
    const fromAddressesMap: Map<string, number> = new Map();
    const involvedAddresses: Map<string, string> = new Map();

    try {
      const flaggedAddresses: Set<string> = new Set(
        (await this.attackService.getFlaggedAddresses()).map(
          (address) => address.attackerAddress,
        ),
      );

      // Retrieve the addresses involved in the transactions
      blockWithTransactions.transactions.forEach((transaction) => {
        involvedAddresses.set(transaction.from, transaction.to);
      });

      // Retrieve the balances of the addresses involved in the transactions
      const balances = checkPriceDrop
        ? await this.alchemyService.getBalances(
            blockWithTransactions.number,
            blockWithTransactions.transactions,
          )
        : new Map();

      // Check large and rapid transactions
      for (const transaction of blockWithTransactions.transactions) {
        // Severity calibration based on individual checks
        let severityPercentage = 0;

        // ? Check if the transaction is a flash loan
        const isFlashLoan = this.isFlashLoanTransaction(
          transaction,
          involvedAddresses,
        );

        // ? Creates an attack object
        const attack = this.attackService.create(
          blockWithTransactions.timestamp,
          transaction,
        );

        // ? Set the attack properties
        attack.isFlashLoan = isFlashLoan;
        attack.amountLostInDollars = this.convertEthToUsd(
          this.convertWeiToEther(transaction.value._hex),
        );

        if (isFlashLoan) {
          severityPercentage += this.getFlashLoanSeverity(
            transaction,
            involvedAddresses,
          );
        } else {
          severityPercentage += this.getFlaggedAddressSeverity(
            transaction,
            flaggedAddresses,
          );
          severityPercentage += this.getLargeTransactionSeverity(transaction);
          severityPercentage += this.getRepeatedActivitySeverity(
            transaction,
            fromAddressesMap,
          );

          if (checkPriceDrop) {
            severityPercentage += this.getBalanceChangeSeverity(
              balances,
              transaction,
            );
          }
        }

        attack.severity = this.determineSeverity(severityPercentage);

        // Only consider transactions with significant risk
        if (severityPercentage >= 30) {
          attacks.add(attack);
        }
      }

      if (attacks.size > 0) {
        await this.attackService.saveAll(Array.from(attacks));
      }

      return Array.from(attacks);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * Determines if a transaction is considered large based on its value.
   *
   * @param {string} weiValue - The value of the transaction in Wei.
   * @param {Object} [options] - Optional parameters.
   * @param {number} [options.largeTransactionThreshold=20] - The threshold value in Ether to consider a transaction as large.
   * @returns {boolean} - True if the transaction value is greater than the threshold, false otherwise.
   */
  private isLargeTransaction(
    weiValue: string,
    { largeTransactionThreshold = 2 } = {},
  ): boolean {
    return this.convertWeiToEther(weiValue) > largeTransactionThreshold;
  }

  /**
   * Determines if a transaction has caused a significant balance change.
   *
   * @param {Map<string, BigNumber>} balances - A map of addresses to their balances.
   * @param {TransactionResponse} transaction - The transaction to evaluate.
   * @param {Object} [options] - Optional parameters.
   * @param {number} [options.balanceChangeThreshold=20] - The threshold for balance change percentage.
   * @returns {boolean} - True if the balance change is significant, false otherwise.
   */
  private hasSignificantBalanceChange(
    balances: Map<string, BigNumber>,
    transaction: TransactionResponse,
    options?: { balanceChangeThreshold?: number },
  ): boolean {
    const { balanceChangeThreshold = 20 } = options || {};

    if (!balances.has(transaction.from) || !transaction.value) {
      return false;
    }

    const fromBalance = this.convertWeiToEther(
      balances.get(transaction.from)._hex,
    );
    const transactionValue = this.convertWeiToEther(transaction.value._hex);

    // Ensure the transaction represents a balance reduction
    if (transactionValue > fromBalance) {
      return false;
    }

    const percentageChange =
      ((fromBalance - transactionValue) / fromBalance) * 100;

    // Check if the percentage change exceeds the threshold
    return Math.abs(percentageChange) > balanceChangeThreshold;
  }

  /**
   * Converts a value in Wei (hex) to Ether.
   *
   * @param {string} weiValue - The value in Wei as hexadecimal.
   * @returns {number} - The value converted to Ether.
   */
  convertWeiToEther(weiValue: string): number {
    // ? Convert the hexadecimal value to a BigNumber
    const weiNumber = parseInt(weiValue, 16);

    // ? Convert Wei to Ether
    const etherValue = weiNumber / 1e18;

    return etherValue;
  }

  /**
   * Determines the severity of an attack based on a percentage.
   *
   * @param {number} severityPercentage - The calculated percentage of severity.
   * @returns {Severity} - The severity level of the attack.
   */
  private determineSeverity(severityPercentage: number): Severity {
    if (severityPercentage >= 80) return 'critical';
    if (severityPercentage >= 50) return 'high';
    if (severityPercentage >= 30) return 'moderate';
    return 'low';
  }

  /**
   * Identifies flash loans based on transaction characteristics.
   *
   * @param {TransactionResponse} transaction - Transaction to analyze.
   * @param {Map<string, string>} involvedAddresses - Addresses involved in the transaction.
   * @returns {boolean} - True if transaction resembles a flash loan, otherwise false.
   */
  private isFlashLoanTransaction(
    transaction: TransactionResponse,
    involvedAddresses: Map<string, string>,
  ): boolean {
    return (
      this.isLargeTransaction(transaction.value._hex) &&
      involvedAddresses.get(transaction.from) === transaction.to
    );
  }

  /**
   * Converts an amount in Ether to USD (using a fixed rate of 1800 USD per Ether).
   *
   * @param {number} ethAmount - The amount in Ether.
   * @returns {number} - The value in USD, rounded to two decimal places.
   */
  convertEthToUsd(ethAmount: number): number {
    const usdValue = ethAmount * 1800;
    return Math.round(usdValue * 100) / 100;
  }

  /**
   * Calculates the severity of a flash loan attack.
   *
   * @param {TransactionResponse} transaction - The transaction to evaluate.
   * @param {Map<string, BigNumber>} balances - A map of address balances.
   * @param {Map<string, string>} involvedAddresses - A map of involved addresses.
   * @returns {number} - Severity percentage based on flash loan characteristics.
   */
  private getFlashLoanSeverity(
    transaction: TransactionResponse,
    involvedAddresses: Map<string, string>,
  ): number {
    return this.isFlashLoanTransaction(transaction, involvedAddresses)
      ? 100
      : 0;
  }

  /**
   * Checks for severity based on flagged addresses.
   *
   * @param {TransactionResponse} transaction - The transaction to check.
   * @param {Set<string>} flaggedAddresses - Set of flagged addresses.
   * @returns {number} - Severity from flagged addresses.
   */
  private getFlaggedAddressSeverity(
    transaction: TransactionResponse,
    flaggedAddresses: Set<string>,
  ): number {
    return flaggedAddresses.has(transaction.from) ? 30 : 0;
  }

  /**
   * Calculates severity based on transaction size.
   *
   * @param {TransactionResponse} transaction - The transaction to check.
   * @returns {number} - Severity from large transaction size.
   */
  private getLargeTransactionSeverity(
    transaction: TransactionResponse,
  ): number {
    return this.isLargeTransaction(transaction.value._hex) ? 15 : 0;
  }

  /**
   * Returns a severity value for repeated activity by a sender address.
   *
   * @param {TransactionResponse} transaction - The transaction to evaluate.
   * @param {Map<string, number>} fromAddressesMap - A map tracking the number of transactions per address.
   * @returns {number} - The severity score based on repeated activity, 10 if under 3, otherwise 20.
   */
  private getRepeatedActivitySeverity(
    transaction: TransactionResponse,
    fromAddressesMap: Map<string, number>,
  ): number {
    const count = fromAddressesMap.get(transaction.from) || 0;
    return count < 3 ? 10 : 20;
  }

  /**
   * Returns a severity value for a significant balance change caused by a transaction.
   *
   * @param {Map<string, BigNumber>} balances - A map of addresses to their balances.
   * @param {TransactionResponse} transaction - The transaction to evaluate.
   * @returns {number} - The severity score for a balance change, 15 if significant, otherwise 0.
   */
  private getBalanceChangeSeverity(
    balances: Map<string, BigNumber>,
    transaction: TransactionResponse,
  ): number {
    return this.hasSignificantBalanceChange(balances, transaction) ? 15 : 0;
  }
}
