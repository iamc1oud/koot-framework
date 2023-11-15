import { CommunicationProtocolEnum, DaprClient } from '@dapr/dapr';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DaprClientService {
  client: DaprClient;

  constructor(host: string, daprGrpcPort: string) {
    this.client = new DaprClient({
      daprHost: host,
      daprPort: daprGrpcPort,
      communicationProtocol: CommunicationProtocolEnum.GRPC,
    });
  }

  public get getClient(): DaprClient {
    return this.client;
  }

  async getConfiguration(keys: string[]) {
    const config = await this.client.configuration.get('configstore', keys);
    return config;
  }
}
