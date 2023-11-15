import { NestFactory } from '@nestjs/core';
import { NotificationModule } from './notification.module';
import { DaprClientService } from '@koot/shared/dapr-client/dapr-client.service';

async function bootstrap() {
  const app = await NestFactory.create(NotificationModule);
  await app.listen(process.env.APP_PORT);
}
bootstrap();
