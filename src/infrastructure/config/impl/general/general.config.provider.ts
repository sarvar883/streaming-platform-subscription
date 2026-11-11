import { EnvKeyStorage } from '@payme/config-container';
import { Logger } from '@payme/logger';
import { Tokens } from '@payme/common';
import { Symbols } from '@di/common/symbols';

import { ConfigModule } from '@infrastructure/config/impl/config.module';
import { GeneralConfigSchema } from '@infrastructure/config/impl/general/general.config.schema';


export const GeneralConfigModule = ConfigModule.forRootAsync({
    provide: Symbols.infrastructure.config.general,
    useFactory(logger: Logger) {
        return {
            logger,
            storage: new EnvKeyStorage(logger),
            schema: GeneralConfigSchema,
        };
    },
    inject: [Tokens.Logger],
});