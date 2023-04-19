import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import helmet from 'helmet';
import {
  DocumentBuilder,
  SwaggerModule,
  SwaggerDocumentOptions,
} from '@nestjs/swagger';
import { v2 as cloudinary } from 'cloudinary';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const baseClientUrl = process.env.BASE_CLIENT_URL;
  const railwayEnvironment = process.env.RAILWAY_ENVIRONMENT;

  if (
    !!railwayEnvironment &&
    railwayEnvironment !== 'production' &&
    railwayEnvironment !== 'staging'
  ) {
    app.enableCors({
      origin: (origin, callback) => {
        callback(undefined, origin);
      },
      credentials: true,
    });
  } else if (baseClientUrl) {
    app.enableCors({ origin: baseClientUrl, credentials: true });
  }

  app.use(cookieParser());
  app.use(helmet());

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  app.setGlobalPrefix('/api/v1');

  const options: SwaggerDocumentOptions = {
    operationIdFactory: (_controllerKey: string, methodKey: string) =>
      methodKey,
  };

  const config = new DocumentBuilder()
    .setTitle('LogisTech')
    .setDescription('API for LogisTech')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT || 5001);
}
bootstrap();
