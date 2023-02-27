import {
  ClassSerializerInterceptor,
  ModuleMetadata,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, Reflector, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import Joi from 'joi';
import { CompanyModule } from '../company/company.module';
import { ProductModule } from '../product/product.module';
import { ReportModule } from '../report/report.module';
import { TransactionModule } from '../transaction/transaction.module';
import { AppController } from '../app.controller';
import { AppService } from '../app.service';
import { AuthenticationModule } from '../authentication/authentication.module';
import { JwtAuthenticationGuard } from '../authentication/guards/jwt-authentication.guard';
import { AuthorizationModule } from '../authorization/authorization.module';
import { ActiveProfilesModule } from '../global/active-profiles/active-profiles.module';
import { E2EModule } from '../global/e2e/e2e.module';
import { PrismaModule } from '../global/prisma/prisma.module';
import { TestDataModule } from '../global/test-data/test-data.module';
import { UserModule } from '../user/user.module';
import { CartModule } from '../cart/cart.module';
import { OrderModule } from '../order/order.module';
import { ScheduleModule } from '@nestjs/schedule';

export const appModule: ModuleMetadata = {
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', 'local.env'],
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_URL: Joi.string().required(),
        PORT: Joi.number(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.number().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.number().required(),
        ACTIVE_PROFILES: Joi.string(),
      }),
    }),
    ScheduleModule.forRoot(),
    AuthenticationModule,
    UserModule,
    AuthorizationModule,
    PrismaModule,
    ActiveProfilesModule,
    TestDataModule,
    E2EModule,
    CompanyModule,
    ProductModule,
    ReportModule,
    TransactionModule,
    CartModule,
    OrderModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useFactory: (reflector: Reflector) =>
        new JwtAuthenticationGuard(reflector),
      inject: [Reflector],
    },
    {
      provide: APP_INTERCEPTOR,
      useFactory: (reflector: Reflector) =>
        new ClassSerializerInterceptor(reflector),
      inject: [Reflector],
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
};
