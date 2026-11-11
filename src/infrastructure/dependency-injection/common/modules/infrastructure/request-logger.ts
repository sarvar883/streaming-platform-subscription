import { Module } from '@nestjs/common';
import { Symbols } from '@di/common/symbols';
import { ConfigContainer } from '@payme/config-container';

import { GeneralConfig, GeneralConfigModule } from '@infrastructure/config/impl';
import { RequestLogger, RequestLoggerImpl, RequestLoggerConfigs } from '@infrastructure/request-logger';

@Module({
    imports: [GeneralConfigModule],
    providers: [
        {
            provide: Symbols.infrastructure.loggers.requestLogger,
            useFactory: (config: ConfigContainer<GeneralConfig>): RequestLogger => {
                const requestLoggerConfigs: RequestLoggerConfigs = {
                    folderPath: config.get('fsLogger.dirPath'),
                    fileName: config.get('fsLogger.requestLoggerFileName'),
                };

                return new RequestLoggerImpl(requestLoggerConfigs);
            },
            inject: [Symbols.infrastructure.config.general],
        },
    ],
    exports: [Symbols.infrastructure.loggers.requestLogger],
})
export class RequestLoggerModule {}