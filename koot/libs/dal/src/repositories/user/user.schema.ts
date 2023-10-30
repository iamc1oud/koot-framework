import { Schema } from 'mongoose';
import * as mongoose from 'mongoose';
import { UserDBModel } from './user.entity';
import { schemaOptions } from '../schema-default.options';

const userSchema = new Schema<UserDBModel>({
    firstName: Schema.Types.String,
    lastName: Schema.Types.String,
    email: Schema.Types.String,
    profilePicture: Schema.Types.String,
    resetToken: Schema.Types.String,
    resetTokenDate: Schema.Types.Date,
    resetTokenCount: {
        reqInDay: Schema.Types.Number,
        reqInMinute: Schema.Types.Number,
    },
    showOnBoarding: Schema.Types.Boolean,
    showOnBoardingTour: {
        type: Schema.Types.Number,
        default: 0
    },
    tokens: [
        {   
            provider: Schema.Types.String,
            providerId: Schema.Types.ObjectId,
            accessToken: Schema.Types.String,
            refreshToken: Schema.Types.String,
            valid: Schema.Types.Boolean,
            lastUsed: Schema.Types.Date,
            username: Schema.Types.String
        }
    ],
    password: Schema.Types.String,
    failedLogin: {
        times: Schema.Types.Number,
        lastFailedAttempt: Schema.Types.Date,
    },
    serviceHashes: {
        intercom: Schema.Types.String,
    }
}, schemaOptions);

export const User = (mongoose.models.User as mongoose.Model<UserDBModel>) ||  mongoose.model<UserDBModel>('User', userSchema);