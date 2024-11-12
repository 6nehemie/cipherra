import { InitiateDetection } from 'types';
import { IsNumber, IsOptional } from 'class-validator';

export class InitiateDetectionDto implements InitiateDetection {
  @IsNumber({}, { message: 'blockNumber is required' })
  blockNumber: number;

  @IsOptional()
  options: {
    checkPriceDrop?: boolean;
  };
}
