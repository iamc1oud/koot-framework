import { DaprClientService } from '@koot/shared/dapr-client/dapr-client.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [DaprClientService],
  controllers: [],
  providers: [],
})
export class AppModule {}
