import { Module } from '@nestjs/common';
import { Symbols } from '@di/common';

import { EntityModel } from '@data/impl/mongo';
import { SetantaDbModule } from '@di/common/modules/infrastructure/db-modules';
import { SetantaUsersRepositoryImpl } from '@data/impl/mongo/repositories';

import { SetantaUsersService, SetantaUsersServiceImpl, SetantaUsersRepository, SetantaUserModel } from '@domain/setanta-users';

@Module({
    imports: [SetantaDbModule],
    providers: [
        {
            provide: Symbols.domain.setantaUsers.setantaUsersService,
            useFactory: (setantaUsersRepository: SetantaUsersRepository): SetantaUsersService => {
                return new SetantaUsersServiceImpl(setantaUsersRepository);
            },
            inject: [Symbols.domain.setantaUsers.setantaUsersRepository],
        },
        {
            provide: Symbols.domain.setantaUsers.setantaUsersRepository,
            useFactory: (entityModel: EntityModel<SetantaUserModel>): SetantaUsersRepository => {
                return new SetantaUsersRepositoryImpl(entityModel);
            },
            inject: [Symbols.domain.setantaUsers.setantaUsersSchema],
        },
    ],
    exports: [Symbols.domain.setantaUsers.setantaUsersService, Symbols.domain.setantaUsers.setantaUsersRepository],
})
export class SetantaUsersModule {}