import { Module } from '@nestjs/common';
import { Symbols } from '@di/common';

import { EntityModel } from '@data/impl/mongo';

import { PaymeDbModule } from '@di/common/modules/infrastructure/db-modules';
import { PaymeUsersRepositoryImpl } from '@data/impl/mongo/repositories';

import { PaymeUsersService, PaymeUsersServiceImpl, PaymeUserModel, PaymeUsersRepository } from '@domain/payme-users';

@Module({
    imports: [PaymeDbModule],
    providers: [
        {
            provide: Symbols.domain.paymeUsers.paymeUsersService,
            useFactory: (paymeUsersRepository: PaymeUsersRepository): PaymeUsersService => {
                return new PaymeUsersServiceImpl(paymeUsersRepository);
            },
            inject: [Symbols.domain.paymeUsers.paymeUsersRepository],
        },
        {
            provide: Symbols.domain.paymeUsers.paymeUsersRepository,
            useFactory: (entityModel: EntityModel<PaymeUserModel>): PaymeUsersRepository => {
                return new PaymeUsersRepositoryImpl(entityModel);
            },
            inject: [Symbols.domain.paymeUsers.paymeUsersSchema],
        },
    ],
    exports: [Symbols.domain.paymeUsers.paymeUsersService, Symbols.domain.paymeUsers.paymeUsersRepository],
})
export class PaymeUsersModule {}