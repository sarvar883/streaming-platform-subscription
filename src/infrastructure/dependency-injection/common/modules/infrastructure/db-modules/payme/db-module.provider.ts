import { ConfigContainer } from '@payme/config-container';
import { Symbols } from '@di/common';
import { GeneralConfig } from '@infrastructure/config/impl';

import { Connection, createConnection, Model } from 'mongoose';

import { PaymeUserModel } from '@domain/payme-users';
import { PaymeUserSchema } from '@data/impl/mongo/schemas';

export const PaymeDbModuleProviders = [
    {
        provide: Symbols.infrastructure.db.paymeDB,
        useFactory: (config: ConfigContainer<GeneralConfig>): Connection | Promise<Connection> => {
            const internalDbName = config.get('paymeDB.dbName');
            const internalDbConnectionString = config.get('paymeDB.dbConnectionString');
            const internalDbAuthEnabled = config.get('paymeDB.dbAuthEnabled');
            const internalDbUsername = config.get('paymeDB.dbUsername');
            const internalDbPassword = config.get('paymeDB.dbPassword');
            const internalDbAuthSource = config.get('paymeDB.dbAuthSource');

            const dbOptions: Record<string, any> = {
                dbName: internalDbName,
            };

            if (internalDbAuthEnabled) {
                dbOptions.auth = {
                    username: internalDbUsername,
                    password: internalDbPassword,
                };
                dbOptions.authSource = internalDbAuthSource;
            }

            // @ts-ignore
            return createConnection(internalDbConnectionString, dbOptions);
        },
        inject: [Symbols.infrastructure.config.general],
    },
    {
        provide: Symbols.domain.paymeUsers.paymeUsersSchema,
        useFactory: (connection: Connection): Model<PaymeUserModel> => connection.model(Symbols.domain.paymeUsers.paymeUsersSchema.toString(), PaymeUserSchema),
        inject: [Symbols.infrastructure.db.paymeDB],
    },
];