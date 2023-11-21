import { Module } from '@nestjs/common';
import { DalService } from './dal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity, UserRepository } from './repositories';

const REPOSITORIES = [
  UserRepository,
];

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'koot',
      entities: [
        UserEntity
      ],
      // NOTE: DO NOT IN PRODUCTION
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      UserEntity,
    ])
  ],
  providers: [DalService, ...REPOSITORIES],
  exports: [DalService, ...REPOSITORIES],
})
export class DalModule {}
