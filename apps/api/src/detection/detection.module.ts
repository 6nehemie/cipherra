import { Module } from '@nestjs/common';
import { AlchemyService } from 'src/alchemy/alchemy.service';
import { DetectionController } from './detection.controller';
import { DetectionService } from './detection.service';
import { TransactionsService } from 'src/transactions/transactions.service';
import { AttacksModule } from 'src/attacks/attacks.module';

@Module({
  imports: [AttacksModule],
  controllers: [DetectionController],
  providers: [DetectionService, AlchemyService, TransactionsService],
})
export class DetectionModule {}
