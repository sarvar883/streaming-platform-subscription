import { AsyncLocalStorage } from 'async_hooks';

import { JsonRpcStrategy, JsonRpcStrategyModule, JsonRpcStrategyOptions } from '@payme/nest-json-rpc';
import { ConfigurableEventPatternModule } from '@payme/nestjs-communication-utils';
import { HttpTransport } from '@payme/json-rpc-http-transport';
import { Tokens } from '@payme/common';
import { Logger } from '@payme/logger';
import { GracefulShutdownModule } from '@payme/nestjs-common';
import { ConfigContainer } from '@payme/config-container';
import { GeneralConfig } from '@infrastructure/config/impl';
import { SetantaDbModule, PaymeDbModule } from '@di/common/modules/infrastructure/db-modules';

import { Symbols } from '@di/common';
import { AsyncLocalStorageModule } from '@di/common/modules/infrastructure/async-local-storage';
import { GeneralConfigModule } from '@infrastructure/config/impl';
import { LoggerModule } from '@infrastructure/logger';

const gracefulShutDown = GracefulShutdownModule.forRoot({
    terminableProviders: [JsonRpcStrategy],
});

export const ApiInfrastructureModule = [
    GeneralConfigModule,
    LoggerModule,
    AsyncLocalStorageModule,
    JsonRpcStrategyModule.registerStrategyAsync({
        useFactory(
            logger: Logger,
            als: AsyncLocalStorage<Map<string, unknown>>,
            config: ConfigContainer<GeneralConfig>
        ): JsonRpcStrategyOptions {
            const waitBeforeShutDown = config.get('waitBeforeShutDown', async (old, newValue) => {
                logger.info(`waitBeforeShutDown: ${old} has been changed to ${newValue}`);
            });

            const traceKey = config.get('traceKey');
            const timeout = config.get('timeout');

            const serverHost: string = config.get('serverHost');
            const serverPort: number = config.get('serverPort');

            return {
                transports: [new HttpTransport({ port: serverPort, host: serverHost }, logger)],
                als,
                logger,
                options: {
                    waitBeforeShutDown,
                    trace: { key: traceKey },
                    timeout,
                },
            };
        },
        inject: [Tokens.Logger, Symbols.infrastructure.storage.asyncStorage, Symbols.infrastructure.config.general],
    }),
    gracefulShutDown,
    PaymeDbModule,
    SetantaDbModule,
    ConfigurableEventPatternModule.forRoot<GeneralConfig>({ pathToConfigs: 'kafka.topics' }),
];