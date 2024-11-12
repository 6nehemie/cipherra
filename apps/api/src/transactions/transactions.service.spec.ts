import { Test, TestingModule } from '@nestjs/testing';
import { AlchemyService } from '../alchemy/alchemy.service';
import { AttackService } from '../attacks/attacks.service';
import { Attacks } from '../attacks/entities/attacks.entity';
import { attacks } from '../utils/test-data/attacks';
import { TransactionsService } from './transactions.service';

import { TransactionResponse } from 'alchemy-sdk';

describe('TransactionsService', () => {
  let transactionService: TransactionsService;
  let attackService: AttackService;
  let alchemyService: AlchemyService;

  beforeEach(async () => {
    const attackList: Attacks[] = [];

    const fakeAlchemyService: Partial<AlchemyService> = {
      getBalances: jest.fn(),
    };
    const fakeAttackService: Partial<AttackService> = {
      create(timestamp: number, transaction: TransactionResponse): Attacks {
        const attack = new Attacks();
        attack.id = attacks.length + 1;
        attack.txHash = transaction.hash;
        attack.attackTime = new Date(timestamp).toISOString();
        attack.isFlashLoan = false;
        attack.attackerAddress = transaction.from;
        attack.victimAddress = transaction.to;
        attack.amountLostInDollars = 0;
        attack.severity = 'low';
        return attack;
      },
      saveAll(attacksList: Attacks[]): Promise<Attacks[]> {
        attackList.push(...attacksList);
        return Promise.resolve(attacksList);
      },
      getFlaggedAddresses(): Promise<Attacks[]> {
        return Promise.resolve(attacks as never as Attacks[]);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: AttackService,
          useValue: fakeAttackService,
        },
        {
          provide: AlchemyService,
          useValue: fakeAlchemyService,
        },
      ],
    }).compile();

    transactionService = module.get<TransactionsService>(TransactionsService);
    attackService = module.get<AttackService>(AttackService);
    alchemyService = module.get<AlchemyService>(AlchemyService);
  });

  it('should be defined', () => {
    expect(transactionService).toBeDefined();
    expect(attackService).toBeDefined();
  });

  describe('getSuspiciousTransactions', () => {});
});
