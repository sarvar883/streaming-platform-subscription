import { Module } from '@nestjs/common';

import { GeneralConfigModule } from '@infrastructure/config/impl';
import { SetantaDBModuleProviders } from '@di/common/modules/infrastructure/db-modules/setanta/db-module.provider';

@Module({
    imports: [GeneralConfigModule],
    providers: [...SetantaDBModuleProviders],
    exports: [...SetantaDBModuleProviders],
})
export class SetantaDbModule {}