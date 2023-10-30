import { DynamicModule, ForwardReference, Logger, Module, Provider, Type } from '@nestjs/common';

const baseModules: Array<Type | DynamicModule | Promise<DynamicModule> | ForwardReference> = [];

const providers: Provider[] = [];

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
