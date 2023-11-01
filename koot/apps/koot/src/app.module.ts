import { DynamicModule, ForwardReference, Logger, Module, Provider, Type } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './app/auth/auth.module';
import './config/env-validator';

const baseModules: Array<Type | DynamicModule | Promise<DynamicModule> | ForwardReference> = [
  // Configuration
];

const providers: Provider[] = [
  AuthModule,
];

if (process.env.NODE_ENV === 'test') {
  // baseModules.push();
}

@Module({
  imports: baseModules,
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {
    Logger.log(`🚀 BOOTSTRAPPED NEST APPLICATION 🚀`);
  }
 }
