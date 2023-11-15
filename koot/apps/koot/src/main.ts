import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  app.setGlobalPrefix('/api/auth');

  await app.listen(process.env.APP_PORT);
}
bootstrap();
