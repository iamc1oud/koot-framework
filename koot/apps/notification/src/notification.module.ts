import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { DaprClientService } from '@koot/shared/dapr-client/dapr-client.service';

@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [
    NotificationService,
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
export class NotificationModule {}
