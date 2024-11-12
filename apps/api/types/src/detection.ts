export interface InitiateDetection {
  blockNumber: number;
}

export type Severity = 'low' | 'moderate' | 'high' | 'critical';

export interface Attack {
  id: number;
  txHash: string;
  attackTime: string;
  isFlashLoan: boolean;
  attackerAddress: string;
  victimAddress: string;
  amountLostInDollars: number;
  severity: Severity;
}

export interface Detection {
  chainId: number;
  blockNumber: number;
  presenceOfAttack: boolean;
  attacks: Attack[];
}
