import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as githubPassport from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(
  githubPassport.Strategy,
  'github',
) {
  constructor() {
    super({
      clientID: '6f2c4bd75e3b706aed76',
      clientSecret: '4235cdb1908e8ff9c709b29691f99698c5276466',
      callbackURL: `http://localhost:${process.env.APP_PORT}/api/auth/github/callback`,
      scope: ['user:email'],
      passReqToCallback: true,
      store: {
        verify(req, state: string, meta, callback) {
          console.log('validation done');
          callback(null, true, JSON.stringify(req.query));
        },
        store(req, meta, callback) {
          callback(null, JSON.stringify(req.query));
        },
      },
    });
  }

  async validate(
    req,
    accessToken: string,
    refreshToken: string,
    profile: githubPassport.Profile,
    done: (err, data) => void,
  ): Promise<any> {
    console.log('validate');

    // TODO: Handle authentication.
    done(null, {
      accessToken,
      refreshToken,
      profile,
    });
  }
}
