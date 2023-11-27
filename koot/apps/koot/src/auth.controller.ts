import { ApiException, buildOauthRedirectUrl } from '@koot/shared';
import { DaprClientService } from '@koot/shared/dapr-client/dapr-client.service';
import {
  Controller,
  Get,
  HttpStatus,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { GITHUB_OAUTH_CLIENT_ID, GITHUB_OAUTH_SECRET_ID } from './constants';
import { AuthGuard } from '@nestjs/passport';
import * as passport from 'passport';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity, UserRepository } from '@koot/dal';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly daprClient: DaprClientService,
    private userRepository: UserRepository,
  ) {}

  @Get()
  async findAll() {
    return {
      data: await this.userRepository.getAll()
    };
  }

  @Get('/github')
  @UseGuards(AuthGuard('github'))
  async github() {
    // Check whether the github token is available.
    const token = await this.daprClient.getConfiguration([
      GITHUB_OAUTH_CLIENT_ID,
      GITHUB_OAUTH_SECRET_ID,
    ]);

    if (Object.keys(token.items).length == 0) {
      throw new ApiException(
        'GitHub auth is not configured, please provide GITHUB_OAUTH_CLIENT_ID and GITHUB_OAUTH_CLIENT_SECRET as env variables',
      );
    }

    try {
      passport.authenticate('github', { scope: ['user:email'] });
    } catch (e) {
      console.log('Error github login: ', e);
    }
  }

  @Get('/github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() request) {
    return {
      user: request.user,
    };
  }
}
