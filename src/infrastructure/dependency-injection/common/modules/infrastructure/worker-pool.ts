import { Module } from '@nestjs/common';
import { Tokens } from '@payme/common';
import { Logger } from '@payme/logger';
import { Symbols } from '@di/common/symbols';
import { ConfigContainer } from '@payme/config-container';
import { GeneralConfig, GeneralConfigModule } from '@infrastructure/config/impl';

import { WorkerPool, TinyWorkerPool, WorkerPoolConfigs } from '@infrastructure/worker-pool';

@Module({
    imports: [GeneralConfigModule],
    providers: [
        {
            provide: Symbols.infrastructure.worker.WorkerPool,
            useFactory: (config: ConfigContainer<GeneralConfig>, logger: Logger): WorkerPool => {
                const workerPoolConfigs: WorkerPoolConfigs = {
                    filename: config.get('workerPool.filename'),
                    processesCount: config.get('workerPool.processesCount'),
                    idleTimeout: config.get('workerPool.idleTimeout'),
                    maxQueue: config.get('workerPool.maxQueue'),
                };

                return new TinyWorkerPool(workerPoolConfigs, logger);
            },
            inject: [Symbols.infrastructure.config.general, Tokens.Logger],
        },
    ],
    exports: [Symbols.infrastructure.worker.WorkerPool],
})
export class WorkerPoolModule {}