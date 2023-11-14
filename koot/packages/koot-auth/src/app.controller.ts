import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    const DAPR_HOST = process.env.DAPR_HOST || 'http://localhost';
    const DAPR_HTTP_PORT = process.env.DAPR_HTTP_PORT || '3500';

    // Adding app id as part of the header
    const axiosConfig = {
      headers: {
        'dapr-app-id': 'order-processor',
      },
    };

    for (let i = 1; i <= 20; i++) {
      const order = { orderId: i };

      // Invoking a service
      const res = await axios.post(
        `${DAPR_HOST}:${DAPR_HTTP_PORT}/orders`,
        order,
        axiosConfig,
      );
      console.log('Order passed: ' + res.config.data);
    }

    return this.appService.getHello();
  }
}
