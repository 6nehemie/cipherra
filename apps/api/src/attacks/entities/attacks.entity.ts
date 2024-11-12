import { Severity } from 'types';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Attacks {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  txHash: string;

  @Column()
  attackTime: string;

  @Column()
  isFlashLoan: boolean;

  @Column()
  attackerAddress: string;

  @Column({ nullable: true })
  victimAddress: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  amountLostInDollars: number;

  @Column()
  severity: Severity;
}
