import { Test, TestingModule } from '@nestjs/testing';
import { TransactionResponse } from 'alchemy-sdk';
import { attacks } from '../utils/test-data/attacks';
import { blocks } from '../utils/test-data/blockWithTransaction';
import { AttackService } from './attacks.service';
import { Attacks } from './entities/attacks.entity';

describe('AddressesService', () => {
  let service: AttackService;
  const attackList: Attacks[] = [];

  beforeEach(async () => {
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
        {
          provide: AttackService,
          useValue: fakeAttackService,
        },
      ],
    }).compile();

    service = module.get<AttackService>(AttackService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new attack entity', () => {
      const timestamp = Date.now();
      const transaction = blocks[0]
        .transactions[0] as never as TransactionResponse;

      const attack = service.create(timestamp, transaction);

      expect(attack).toEqual({
        id: attacks.length + 1,
        txHash: transaction.hash,
        attackTime: new Date(timestamp).toISOString(),
        isFlashLoan: false,
        attackerAddress: transaction.from,
        victimAddress: transaction.to,
        amountLostInDollars: 0,
        severity: 'low',
      });
    });
  });

  describe('saveAll', () => {
    it('should save a list of attacks to the database', async () => {
      const transactions = blocks[0].transactions.map((transaction) => {
        const attack = service.create(
          Date.now(),
          transaction as never as TransactionResponse,
        );
        return attack;
      });

      service.saveAll(transactions);

      expect(attackList.length).toBeGreaterThan(0);
    });
  });

  describe('getFlaggedAddresses', () => {
    it('should retrieve flagged addresses from the database', async () => {
      const flaggedAddresses = await service.getFlaggedAddresses();

      expect(flaggedAddresses).toEqual(attacks);
    });
  });
});
