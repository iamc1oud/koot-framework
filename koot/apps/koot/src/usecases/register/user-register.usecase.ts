import { Injectable } from '@nestjs/common';
import { UserRepository } from '@koot/dal';
import { AuthService } from '../../services/auth.service';
import { UserRegisterCommand } from './user-register.command';
import { ApiException } from '@koot/shared';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';

@Injectable()
export class RegiserUser {
  constructor(
    private authService: AuthService,
    private userRepository: UserRepository,
  ) {}

  async execute(command: UserRegisterCommand) {
    const existingUser = await this.userRepository.findByEmail(command.email);

    if (existingUser) throw new ApiException('User already exists');

      const passwordHash = await bcrypt.hash(command.password, 10);
      

      
      // TODO: Analytics service for upsert of user.
      
    //   return {
    //       user: await this.userRepository.findById(user.id),
    //       token: await this.authService.generateUserToken(user),
      //   }
      return
  }
}
