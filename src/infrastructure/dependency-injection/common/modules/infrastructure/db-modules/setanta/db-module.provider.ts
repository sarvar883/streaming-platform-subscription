import { ConfigContainer } from '@payme/config-container';
import { Symbols } from '@di/common';
import { GeneralConfig } from '@infrastructure/config/impl';

import { Connection, createConnection, Model } from 'mongoose';

import { SetantaUserModel } from '@domain/setanta-users';
import { SetantaUserSchema } from '@data/impl/mongo/schemas';

import { SetantaActivationModel } from '@domain/setanta-activations';
import { SetantaActivationSchema } from '@data/impl/mongo/schemas';

import { StateHistoryModel } from '@domain/state-history';
import { StateHistorySchema } from '@data/impl/mongo/schemas/setanta-history';

import { TaskModel } from '@domain/task';
import { TaskSchema } from '@data/impl/mongo/schemas/task';

export const SetantaDBModuleProviders = [
    {
        provide: Symbols.infrastructure.db.setantaDB,
        useFactory: (config: ConfigContainer<GeneralConfig>): Connection | Promise<Connection> => {
            const internalDbName = config.get('setantaDB.dbName');
            const internalDbConnectionString = config.get('setantaDB.dbConnectionString');
            const internalDbAuthEnabled = config.get('setantaDB.dbAuthEnabled');
            const internalDbUsername = config.get('setantaDB.dbUsername');
            const internalDbPassword = config.get('setantaDB.dbPassword');
            const internalDbAuthSource = config.get('setantaDB.dbAuthSource');

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
        provide: Symbols.domain.setantaUsers.setantaUsersSchema,
        useFactory: (connection: Connection): Model<SetantaUserModel> => connection.model(Symbols.domain.setantaUsers.setantaUsersSchema.toString(), SetantaUserSchema),
        inject: [Symbols.infrastructure.db.setantaDB],
    },
    {
        provide: Symbols.domain.setantaActivations.activationsSchema,
        useFactory: (connection: Connection): Model<SetantaActivationModel> => connection.model(Symbols.domain.setantaActivations.activationsSchema.toString(), SetantaActivationSchema),
        inject: [Symbols.infrastructure.db.setantaDB],
    },
    {
        provide: Symbols.domain.stateHistory.stateHistorySchema,
        useFactory: (connection: Connection): Model<StateHistoryModel> => connection.model(Symbols.domain.stateHistory.stateHistorySchema.toString(), StateHistorySchema),
        inject: [Symbols.infrastructure.db.setantaDB],
    },
    {
        provide: Symbols.domain.task.taskSchema,
        useFactory: (connection: Connection): Model<TaskModel> => connection.model(Symbols.domain.task.taskSchema.toString(), TaskSchema),
        inject: [Symbols.infrastructure.db.setantaDB],
    },
];