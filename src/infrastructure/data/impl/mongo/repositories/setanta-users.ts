import { EntityModel, MongooseRepository } from '@data/impl/mongo';

import {
    SetantaUser,
    SetantaUserModel,
    SetantaUsersRepository,
} from '@domain/setanta-users';


export class SetantaUsersRepositoryImpl extends MongooseRepository<SetantaUserModel, SetantaUser> implements SetantaUsersRepository {
    constructor(
        private readonly entityModel: EntityModel<SetantaUserModel>,
    ) {
        super(entityModel, SetantaUser);
    }

    async getByPaymeUserId(userId: string): Promise<SetantaUser> {
        return await this.getOne({ externalUserId: userId });
    }
}