import { Controller, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { DaprClientService } from '@koot/shared/dapr-client/dapr-client.service';

@Controller()
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly daprClient: DaprClientService,
  ) {}

  @Get()
  async getHello() {
    return this.notificationService.getHello();
  }
}
