import { AsyncLocalStorage } from 'node:async_hooks';
import { Global, Module } from '@nestjs/common';
import { Tokens } from '@payme/common';
import { Logger } from '@payme/logger';
import { ConsoleLogger } from '@payme/console-logger';

import { Symbols } from '@di/common';
import { AsyncLocalStorageModule } from '@di/common/modules/infrastructure/async-local-storage';

@Global()
@Module({
    imports: [AsyncLocalStorageModule],
    providers: [
        {
            provide: Tokens.Logger,
            useFactory(als: AsyncLocalStorage<Map<string, unknown>>): Logger {
                const logger = new ConsoleLogger({ als });

                logger.setLogLevel('*');
                // @ts-ignore
                return logger;
            },
            inject: [Symbols.infrastructure.storage.asyncStorage],
        },
    ],
    exports: [Tokens.Logger],
})
export class LoggerModule {}