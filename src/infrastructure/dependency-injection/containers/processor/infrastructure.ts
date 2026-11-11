import { LoggerModule } from '@infrastructure/logger';
import { GeneralConfigModule } from '@infrastructure/config/impl';
import { AsyncLocalStorageModule } from '@di/common/modules/infrastructure/async-local-storage';

export const ProcessorInfrastructureModule = [
    GeneralConfigModule,
    LoggerModule,
    AsyncLocalStorageModule,
];