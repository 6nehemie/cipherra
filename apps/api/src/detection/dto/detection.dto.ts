import { Detection } from 'types';
import { Expose } from 'class-transformer';
import { Attacks } from 'src/attacks/entities/attacks.entity';

export class DetectionDto implements Detection {
  @Expose()
  chainId: number;

  @Expose()
  blockNumber: number;

  @Expose()
  presenceOfAttack: boolean;

  @Expose()
  attacks: Attacks[];
}
