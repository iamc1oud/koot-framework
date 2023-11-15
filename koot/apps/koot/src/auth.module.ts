import { DaprClientService } from '@koot/shared/dapr-client/dapr-client.service';
import { Module, Provider } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { GITHUB_OAUTH_CLIENT_ID, GITHUB_OAUTH_SECRET_ID } from './constants';
import { GithubStrategy } from './services/passport/github.strategy';
import { PassportModule } from '@nestjs/passport';

const AUTH_PROVIDER: Provider[] = [];

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: 'github',
    }),
  ],
  controllers: [AuthController],
  providers: [
    GithubStrategy,
    {
      provide: DaprClientService,
      useFactory: async () => {
        const client = new DaprClientService(
          process.env.DAPR_HOST,
          process.env.DAPR_GRPC_PORT,
        );

        // Check whether the github token is available.
        const token = await client.getConfiguration([
          GITHUB_OAUTH_CLIENT_ID,
          GITHUB_OAUTH_SECRET_ID,
        ]);

        if (Object.keys(token.items).length != 0) {
          console.log('Pushed github strategy');

          // AUTH_PROVIDER.push(GithubStrategy);
        }
        return client;
      },
    },
    ...AUTH_PROVIDER,
  ],
})
export class AuthModule {}
