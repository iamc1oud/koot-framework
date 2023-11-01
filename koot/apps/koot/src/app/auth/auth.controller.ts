import { UserRepository } from "@koot/dal";
import { Controller, Get, Logger } from "@nestjs/common";
import { ApiException } from "../shared/exceptions/api.exception";

@Controller('/auth')
export class AuthController {
    constructor(
        private readonly userRepository: UserRepository,
    ) {}

    @Get('/github')
    githubAuth() {
        Logger.verbose('Checking Github Auth');

        // If github auth is not setup in env file.
        if (!process.env.GITHUB_OAUTH_CLIENT_ID || !process.env.GITHUB_OAUTH_CLIENT_SECRET) {
          throw new ApiException(
            'GitHub auth is not configured, please provide GITHUB_OAUTH_CLIENT_ID and GITHUB_OAUTH_CLIENT_SECRET as env variables'
          );
        }
    
        Logger.verbose('Github Auth has all variables.');
    
        return {
          success: true,
        };
      }
}