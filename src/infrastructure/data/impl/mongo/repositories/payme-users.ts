import { EntityModel, MongooseRepository } from '@data/impl/mongo';

import {
    PaymeUser,
    PaymeUserModel,
    PaymeUsersRepository,
} from '@domain/payme-users';


export class PaymeUsersRepositoryImpl extends MongooseRepository<PaymeUserModel, PaymeUser> implements PaymeUsersRepository {
    constructor(
        private readonly entityModel: EntityModel<PaymeUserModel>,
    ) {
        super(entityModel, PaymeUser);
    }

    async getUserById(id: string): Promise<PaymeUser | null> {
        return await this.getById(id);
    }
}