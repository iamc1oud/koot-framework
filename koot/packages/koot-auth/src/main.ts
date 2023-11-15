import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CommunicationProtocolEnum, DaprClient } from '@dapr/dapr';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('/api');

  await app.listen(3000);
}
bootstrap();
