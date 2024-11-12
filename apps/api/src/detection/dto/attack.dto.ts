import { Attack, Severity } from 'types';
import { Expose } from 'class-transformer';

@Expose()
export class AttackDto implements Attack {
  @Expose()
  id: number;

  @Expose()
  txHash: string;

  @Expose()
  attackTime: string;

  @Expose()
  isFlashLoan: boolean;

  @Expose()
  attackerAddress: string;

  @Expose()
  victimAddress: string;

  @Expose()
  amountLostInDollars: number;

  @Expose()
  severity: Severity;
}
