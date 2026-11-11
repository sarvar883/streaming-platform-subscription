import { Module } from '@nestjs/common';
import { Symbols } from '@di/common';
import { SetantaServiceRepository } from '@domain/setanta';
import { SetantaServiceAPIRepositoryImpl } from '@infrastructure/setanta-service-api-repository/setanta-service-repository';
import { SetantaClient } from '@infrastructure/setanta-client';
import { SetantaClientModule } from '@di/common/modules/infrastructure/setanta-client-module';
import { RequestLogger } from '@infrastructure/request-logger';
import { RequestLoggerModule } from '@di/common/modules/infrastructure/request-logger';

@Module({
    imports: [SetantaClientModule, RequestLoggerModule],
    providers: [
        {
            provide: Symbols.domain.setantaService.setantaRepository,
            useFactory: (setantaClient: SetantaClient, requestLogger: RequestLogger): SetantaServiceRepository => {
                return new SetantaServiceAPIRepositoryImpl(setantaClient, requestLogger);
            },
            inject: [Symbols.infrastructure.setantaClient.setantaClient, Symbols.infrastructure.loggers.requestLogger],
        }
    ],
    exports: [Symbols.domain.setantaService.setantaRepository],
})
export class SetantaServiceRepositoryModule {}