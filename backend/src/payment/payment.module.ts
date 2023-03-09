import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { EnvironmentVariableKeys } from '../shared/constants/environment-variable-keys';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  providers: [
    PaymentService,
    {
      provide: Stripe,
      useFactory: (configService: ConfigService) => {
        return new Stripe(
          configService.get<string>(EnvironmentVariableKeys.STRIPE_API_KEY),
          { apiVersion: '2022-11-15' }
        );
      },
      inject: [ConfigService],
    },
  ],
  exports: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
