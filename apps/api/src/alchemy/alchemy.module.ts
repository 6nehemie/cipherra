import { Global, Module } from '@nestjs/common';
import { AlchemyService } from './alchemy.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Alchemy, Network } from 'alchemy-sdk';

@Global() // Makes this module available for other modules
@Module({
  imports: [ConfigModule],
  providers: [
    AlchemyService,

    {
      provide: 'ALCHEMY',
      useFactory: (configService: ConfigService) => {
        const apiKey = configService.get<string>('ALCHEMY_API_KEY');
        const network = Network.ETH_MAINNET;

        return new Alchemy({ apiKey, network });
      },
      inject: [ConfigService], // Inject ConfigService to access environment variables
    },
  ],
  exports: ['ALCHEMY'], // Makes it available for other modules
})
export class AlchemyModule {}
