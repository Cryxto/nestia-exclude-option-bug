import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { NestiaSwaggerComposer } from '@nestia/sdk';
import { SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  //the health is supposed to be on http://localhost:3000/health but the generated openapi docs still follow global prefix http://localhost:3000/api/health

  app.setGlobalPrefix('api', {
    exclude: [
      {
        path: 'health',
        method: RequestMethod.ALL,
      },
    ],
  });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: VERSION_NEUTRAL,
  });


  const document = await NestiaSwaggerComposer.document(app, {
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Localhost',
      },
    ],
  });

  SwaggerModule.setup('api-docs', app, document as any);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap().catch(console.error);
