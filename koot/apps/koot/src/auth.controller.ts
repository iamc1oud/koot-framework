import { DaprClientService } from '@koot/shared/dapr-client/dapr-client.service';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AuthController {
  constructor(private readonly daprClient: DaprClientService) {}

  @Get()
  async configuration() {
    const keys = this.daprClient.getConfiguration([]);
    return keys;
  }
}
