import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attacks } from './entities/attacks.entity';
import { In, Repository } from 'typeorm';

import { generic } from '../utils/generic';
import { TransactionResponse } from 'alchemy-sdk';

/**
 * Service for storing and retrieving flagged Addresses.
 */
@Injectable()
export class AttackService {
  constructor(
    @InjectRepository(Attacks)
    private readonly attacksRepository: Repository<Attacks>,
  ) {}

  /**
   * Retrieves flagged addresses from the database.
   *
   * @returns {Promise<Attacks[]>} - A promise that resolves to an array of flagged addresses.
   * @throws {InternalServerErrorException} - If an error occurs while retrieving the addresses.
   */
  async getFlaggedAddresses(): Promise<Attacks[]> {
    try {
      return await this.attacksRepository.find({
        select: ['attackerAddress'],
      });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(generic.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Creates a new attack entity based on the given transaction.
   *
   * @param {number} timestamp - The timestamp of the attack.
   * @param {TransactionResponse} transaction - The transaction to create the attack from.
   * @returns {Attacks} - The created attack entity.
   */
  create(timestamp: number, transaction: TransactionResponse): Attacks {
    const attack = new Attacks();

    attack.txHash = transaction.hash;
    attack.attackTime = new Date(timestamp).toISOString();
    attack.isFlashLoan = false;
    attack.attackerAddress = transaction.from;
    attack.victimAddress = transaction.to;
    attack.amountLostInDollars = 0;
    attack.severity = 'low';

    return attack;
  }

  /**
   * Saves a list of attacks to the database, ensuring no duplicates.
   *
   * @param {Attacks[]} attacks - The list of attacks to save.
   * @returns {Promise<Attacks[]>} - A promise that resolves to the saved attacks.
   * @throws {InternalServerErrorException} - If an error occurs while saving the attacks.
   */
  async saveAll(attacks: Attacks[]): Promise<Attacks[]> {
    const nonExistentAttacks: Set<Attacks> = new Set();

    try {
      // Get all txHashes and find existing attacks in parallel
      const txHashes = attacks.map((attack) => attack.txHash);
      const existingAttacks = await this.attacksRepository.find({
        where: { txHash: In(txHashes) },
      });

      // Create a Set of existing txHashes for easy lookup
      const existingTxHashes = new Set(
        existingAttacks.map((attack) => attack.txHash),
      );

      // Add non-existing attacks to the Set
      attacks.forEach((attack) => {
        if (!existingTxHashes.has(attack.txHash)) {
          nonExistentAttacks.add(attack);
        }
      });

      return await this.attacksRepository.save(Array.from(nonExistentAttacks));
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(generic.INTERNAL_SERVER_ERROR);
    }
  }
}
