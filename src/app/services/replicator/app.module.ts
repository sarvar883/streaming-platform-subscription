import { Module } from '@nestjs/common';

import { LoggerModule } from '@infrastructure/logger';
import { GeneralConfigModule } from '@infrastructure/config/impl';
import { ReplicatorEventController } from '@infrastructure/controllers/replicator/replicatorEventController';
import { UseCasesModule } from '@di/common/modules/domain/usecases-module/usecases-module';

@Module({
    imports: [
        LoggerModule,
        GeneralConfigModule,
        UseCasesModule,
    ],
    controllers: [ReplicatorEventController],
    providers: [],
})
export class AppModule {}