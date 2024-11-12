import { Module } from '@nestjs/common';
import { AttacksModule } from 'src/attacks/attacks.module';
import { TransactionsService } from './transactions.service';
import { AlchemyService } from 'src/alchemy/alchemy.service';

@Module({
  imports: [AttacksModule],
  providers: [TransactionsService, AlchemyService],
})
export class TransactionsModule {}
