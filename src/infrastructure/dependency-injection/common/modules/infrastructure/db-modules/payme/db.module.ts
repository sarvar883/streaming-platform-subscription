import { Module } from '@nestjs/common';

import { GeneralConfigModule } from '@infrastructure/config/impl';
import { PaymeDbModuleProviders } from '@di/common/modules/infrastructure/db-modules/payme/db-module.provider';

@Module({
    imports: [GeneralConfigModule],
    providers: [...PaymeDbModuleProviders],
    exports: [...PaymeDbModuleProviders],
})
export class PaymeDbModule {}