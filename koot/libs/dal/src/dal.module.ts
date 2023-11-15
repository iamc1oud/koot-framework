import { Module } from '@nestjs/common';
import { DalService } from './dal.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './repositories';

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
  ],
  providers: [DalService],
  exports: [DalService],
})
export class DalModule {}
