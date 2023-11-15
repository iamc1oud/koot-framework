import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import axios from 'axios';

@Controller('/auth')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    return this.appService.getHello();
  }

  @Get('/github')
  async github() {
    return 'Login as github account';
  }
}
