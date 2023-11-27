import { BaseCommand } from '@koot/shared';
import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  MinLength,
} from 'class-validator';

export class UserRegisterCommand extends BaseCommand {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsDefined()
  @MinLength(4)
  password: string;

  @IsDefined()
  firstName: string;

  @IsOptional()
  lastName: string;
}
