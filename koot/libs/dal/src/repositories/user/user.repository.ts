import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from '@koot/dal/base-repository';

export class UserRepository extends BaseRepository<UserEntity> {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
      super(UserEntity, userRepository);
  }

  async getAll() {
    return await this.userRepository.find({});
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }
    
  async findById(id: number): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }
}
