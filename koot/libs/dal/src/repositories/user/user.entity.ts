import { UserId } from './types';
import { Exclude } from 'class-transformer';

export enum AuthProviderEnum {
    GOOGLE = 'google',
    GITHUB = 'github',
  }
  
  export enum UserRoleEnum {
    USER = 'user',
  }

export interface IUserToken {
    provider: AuthProviderEnum;
    providerId: string;
    accessToken: string;
    refreshToken: string;
    valid: boolean;
    username?: string;
}

export interface IUserResetTokenCount {
    reqInMinute: number;
    reqInDay: number;
}

export class UserEntity {
    _id: UserId;

    resetToken?: string;

    resetTokenDate?: string;

    resetTokenCount?: IUserResetTokenCount;

    firstName?: string | null;

    lastName?: string | null;

    email?: string | null;

    profilePicture?: string | null;

    @Exclude({ toPlainOnly: true })
    tokens: IUserToken[];

    @Exclude({ toPlainOnly: true })
    password?: string;

    createdAt: string;

    showOnBoarding?: boolean;
    showOnBoardingTour?: number;

    failedLogin?: {
        times: number;
        lastFailedAttempt: string;
    };

    serviceHashes?: {
        intercom?: string;
    };
}

export type UserDBModel = UserEntity;
