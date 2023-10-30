// Import necessary modules and dependencies
import { createHash } from "crypto";
import { BaseRepository } from "../base-repository";
import { AuthProviderEnum, IUserResetTokenCount, UserDBModel, UserEntity } from "./user.entity";
import { User } from "./user.schema";

// Define a UserRepository class that extends the BaseRepository
export class UserRepository extends BaseRepository<UserDBModel, UserEntity, object> {
    constructor() {
        super(User, UserEntity); // Initialize the base repository with the User model and UserEntity class
    }

    // Asynchronously find a user by their email
    async findByEmail(email: string): Promise<UserEntity | null> {
        return this.findOne({
            email,
        });
    }

    // Asynchronously find a user by their ID
    async findById(id: string, select?: string): Promise<UserEntity | null> {
        const data = await this.MongooseModel.findById(id, select);
        if (!data) return null;

        return this.mapEntity(data.toObject());
    }

    // Private method to hash a reset token using SHA-256
    private hashResetToken(token: string) {
        return createHash('sha256').update(token).digest('hex');
    }

    // Asynchronously find a user by their reset token
    async findUserByToken(token: string) {
        return await this.findOne({
            resetToken: this.hashResetToken(token),
        });
    }

    // Asynchronously update a user's password reset token and related information
    async updatePasswordResetToken(userId: string, token: string, resetTokenCount: IUserResetTokenCount) {
        return await this.update(
            {
                _id: userId,
            },
            {
                $set: {
                    resetToken: this.hashResetToken(token),
                    resetTokenDate: new Date(),
                    resetTokenCount,
                },
            }
        );
    }

    // Asynchronously find a user by their login provider (e.g., OAuth provider)
    async findByLoginProvider(profileId: string, provider: AuthProviderEnum): Promise<UserEntity | null> {
        return this.findOne({
            'tokens.providerId': profileId,
            'tokens.provider': provider,
        });
    }

    // Check if a user with the given ID exists
    async userExists(userId: string) {
        return !!(await this.findOne(
            {
                _id: userId,
            },
            '_id'
        ));
    }
}
