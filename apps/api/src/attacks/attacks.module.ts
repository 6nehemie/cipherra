import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttackService } from './attacks.service';
import { Attacks } from './entities/attacks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attacks])],
  providers: [AttackService],
  exports: [AttackService],
})
export class AttacksModule {}
