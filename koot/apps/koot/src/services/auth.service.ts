import { AuthProviderEnum, UserEntity, UserRepository } from '@koot/dal';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUser } from '../usecases/create-user/create-user.usecase';
import { CreateUserCommand } from '../usecases/create-user/create-user.command';
import { ApiException } from '@koot/shared';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private createUserUsecase: CreateUser,
  ) {}

  async authenticate(
    authProvider: AuthProviderEnum,
    accessToken: string,
    refreshToken: string,
    profile: {
      name: string;
      login: string;
      email: string;
      avatar_url: string;
      id: string;
    },
    uniqueId: string,
  ) {
    let user = await this.userRepository.findByEmail(profile.email);

    let newUser = false;

    if (!user) {
      const firstName = profile.name
        ? profile.name.split(' ').slice(0, -1).join(' ')
        : profile.login;
      const lastName = profile.name
        ? profile.name.split(' ').slice(-1).join(' ')
        : null;
      
      console.log({
        auth: {
          accessToken: accessToken,
          profileId: profile.id,
          provider: authProvider,
          refreshToken,
          username: profile.name,
        },
        email: profile.email,
        firstName,
        lastName,
        picture: profile.avatar_url,
      });

      user = await this.createUserUsecase.execute(
        CreateUserCommand.create({
          auth: {
            accessToken: accessToken,
            profileId: profile.id,
            provider: authProvider,
            refreshToken,
            username: profile.name,
          },
          email: profile.email,
          firstName,
          lastName,
          picture: profile.avatar_url,
        }),
      );

      newUser = true;

      if (uniqueId) {
        // Analytics service.
      }
    } else {
      if (
        authProvider == AuthProviderEnum.GITHUB ||
        authProvider == AuthProviderEnum.GOOGLE
      ) {
        user = await this.updateUserUsername(user, profile, authProvider);
      }
    }

    return {
      newUser,
      token: await this.generateUserToken(user),
    };
  }

  async updateUserUsername(
    user: UserEntity,
    profile: {
      name: string;
      login: string;
      email: string;
      avatar_url: string;
      id: string;
    },
    authProvider: AuthProviderEnum,
  ): Promise<UserEntity> {
    const withoutUsername = user.tokens.find(
      (token) =>
        token.provider == authProvider &&
        !token.username &&
        String(token.providerId) == String(profile.id),
    );

    if (withoutUsername) {
      // Find the index of the token without a username
      const tokenIndex = user.tokens.findIndex(
        (token) =>
          token.provider == authProvider &&
          !token.username &&
          String(token.providerId) == String(profile.id),
      );

      // Update the user entity in memory (if the token is found)
      if (tokenIndex !== -1) {
        user.tokens[tokenIndex].username = profile.login;
      }

      // Update the user entity in the database
      await this.userRepository.save(user);

      user = await this.userRepository.findById(user.id);

      if (!user) throw new ApiException('User not found');
    }

    return user;
  }

  async generateUserToken(user: UserEntity) {
    //  TODO: Can add database check for access to available projects for current user.
    return this.getSignedToken(user);
  }

  async getSignedToken(user: UserEntity) {
    const roles = [];

    return this.jwtService.sign(
      {
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        roles,
      },
      {
        expiresIn: '30 days',
        issuer: 'koot_api',
        secret: 'koot',
      },
    );
  }
}
