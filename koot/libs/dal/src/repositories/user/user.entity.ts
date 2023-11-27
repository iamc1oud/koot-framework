import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';

export interface IUserResetTokenCount {
  reqInMinute: number;
  reqInDay: number;
}

export enum AuthProviderEnum {
  GITHUB = 'github',
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
}

export interface IUserToken {
  providerId: string;
  provider: AuthProviderEnum;
  accessToken: string;
  refreshToken?: string;
  valid: boolean;
  username?: string;
}

export interface IUserFailedLogin {
  times: number;
  lastFailedAttempt: string;
}

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column({ nullable: true })
  resetToken?: string;

  @Column({ nullable: true })
  resetTokenDate?: string;

  @Column('simple-json', {
    default: { reqInMinute: 0, reqInDay: 0 },
    nullable: true,
  })
  resetTokenCount: IUserResetTokenCount;

  @Column({ nullable: true })
  firstName?: string | null;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  email?: string | null;

  @Column({ nullable: true })
  profilePicture?: string;

  @Column('simple-array', { nullable: true })
  @Exclude({ toPlainOnly: true })
  tokens: IUserToken[];

  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  password?: string;

  @Column({ default: false })
  showOnBoarding?: boolean;

  @Column({ default: 0 })
  showOnBoardingTour?: number;

  @Column('simple-json', { default: {} })
  failedLogin?: IUserFailedLogin;

  @Column({ default: true })
  isActive: boolean;
}
