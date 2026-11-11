import { Module, Global } from '@nestjs/common';
import { Symbols } from '@di/common/symbols';

import { asyncLocalStorage } from '@infrastructure/als';

@Global()
@Module({
    providers: [
        {
            provide: Symbols.infrastructure.storage.asyncStorage,
            useValue: asyncLocalStorage,
        },
    ],
    exports: [Symbols.infrastructure.storage.asyncStorage],
})
export class AsyncLocalStorageModule {}