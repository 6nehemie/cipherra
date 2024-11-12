import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { DetectionModule } from './detection/detection.module';
import { AlchemyModule } from './alchemy/alchemy.module';
import { TransactionsModule } from './transactions/transactions.module';
import { AttacksModule } from './attacks/attacks.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';
import { Attacks } from './attacks/entities/attacks.entity';
import { ApiKeyModule } from './api-key/api-key.module';

@Module({
  imports: [
    DetectionModule,
    AlchemyModule,
    TransactionsModule,
    AttacksModule,
    ConfigModule.forRoot({
      isGlobal: true, // allows the configuration to be available globally
    }),
    TypeOrmModule.forRoot({
      type: 'postgres', // Adjust to your database type
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE,
      entities: [Attacks],
      synchronize: true, // only in dev mode
      // logging: true, // Enable logging for debugging
    }),
    ApiKeyModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
