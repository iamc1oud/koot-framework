import { Controller, Get } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { DaprClientService } from '@koot/shared/dapr-client/dapr-client.service';
import { SubscribeConfigurationCallback } from '@dapr/dapr/types/configuration/SubscribeConfigurationCallback';
import { SubscribeConfigurationResponse } from '@dapr/dapr/types/configuration/SubscribeConfigurationResponse';

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
