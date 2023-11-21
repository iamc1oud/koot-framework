import { Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { DaprClientService } from './dapr-client/dapr-client.service';


@Module({
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {}
