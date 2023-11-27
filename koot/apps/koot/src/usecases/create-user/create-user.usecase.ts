import { Injectable } from "@nestjs/common";
import { CreateUserCommand } from "./create-user.command";
import { UserEntity, UserRepository } from "@koot/dal";

@Injectable()
export class CreateUser {
    constructor(
        private readonly userRepository: UserRepository,
    ) { }
    
    async execute(command: CreateUserCommand) {
        const user = new UserEntity();

        user.email = command.email ? command.email.toLowerCase() : null;
        user.firstName = command.firstName ? command.firstName.toLowerCase() : null;
        user.lastName = command.lastName ? command.lastName.toLowerCase() : null;
        user.profilePicture = command.picture;
        user.showOnBoarding = true;
        user.tokens = [
            {
                username: command.auth.username,
                accessToken: command.auth.accessToken,
                provider: command.auth.provider,
                providerId: command.auth.profileId,
                refreshToken: command.auth.refreshToken,
                valid: true,
            }
        ];

        return await this.userRepository.create(user);
    }
}