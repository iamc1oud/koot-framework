import { DaprClientService } from '@koot/shared/dapr-client/dapr-client.service';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [
    {
      provide: DaprClientService,
      useFactory: () => {
        const client = new DaprClientService(
          process.env.DAPR_HOST,
          process.env.DAPR_GRPC_PORT,
        );

        return client;
      },
    },
  ],
})
export class AuthModule {}
