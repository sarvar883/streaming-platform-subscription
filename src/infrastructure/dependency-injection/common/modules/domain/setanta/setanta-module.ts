import { Module } from '@nestjs/common';
import { Symbols } from '@di/common';

import { SetantaService, SetantaServiceImpl, SetantaServiceRepository } from '@domain/setanta';
import { SetantaServiceRepositoryModule } from '@di/common/modules/infrastructure/setanta-service-module';

@Module({
    imports: [SetantaServiceRepositoryModule],
    providers: [
        {
            provide: Symbols.domain.setantaService.setantaService,
            useFactory: (setantaRepository: SetantaServiceRepository): SetantaService => {
                return new SetantaServiceImpl(setantaRepository);
            },
            inject: [Symbols.domain.setantaService.setantaRepository],
        },
    ],
    exports: [Symbols.domain.setantaService.setantaService],
})
export class SetantaModule {}