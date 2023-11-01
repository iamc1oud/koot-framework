import { Module } from "@nestjs/common";
import { SharedModule } from "../shared/shared.module";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from "./auth.controller";

@Module({
    imports: [
        SharedModule,
        PassportModule.register({
            defaultStrategy: 'jwt'
        }),
        JwtModule.register({
            secretOrKeyProvider: () => process.env.JWT_SECRET as string,
            signOptions: {
                expiresIn: 360000,
            },
        }),
    ],
    controllers: [
        AuthController,
    ],
    providers: [],
    exports: [],
})
export class AuthModule { }
