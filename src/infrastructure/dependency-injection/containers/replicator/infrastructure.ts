import { ConfigurableEventPatternModule } from '@payme/nestjs-communication-utils';
import { LoggerModule } from '@infrastructure/logger';
import { GeneralConfig, GeneralConfigModule} from '@infrastructure/config/impl';

import { AsyncLocalStorageModule } from '@di/common/modules/infrastructure/async-local-storage';

export const ReplicatorContainerModule = [
    GeneralConfigModule,
    LoggerModule,
    AsyncLocalStorageModule,
    ConfigurableEventPatternModule.forRoot<GeneralConfig>({ pathToConfigs: 'kafka.topics' }),
];