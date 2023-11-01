import { DataLayerService, UserRepository } from "@koot/dal";
import { Module } from "@nestjs/common";

const DAL_MODELS = [
    UserRepository,
];

// TODO: add logger module in application-generic.

const dalService = {
    provide: DataLayerService,
    useFactory: async () => {
        const service = new DataLayerService();
        await service.connect(process.env.MONGO_URL);

        return service;
    },
}

const PROVIDERS = [
    // Add any other services like storageService, notificationService, etc. here.
    dalService,
    ...DAL_MODELS,
];

@Module({
    controllers: [

    ],
    imports: [],
    providers: [...PROVIDERS],
    exports: [...PROVIDERS],
})
export class SharedModule { }
