import { Module } from '@nestjs/common';
import { Symbols } from '@di/common';
import { ConfigContainer } from '@payme/config-container';
import { GeneralConfig, GeneralConfigModule } from '@infrastructure/config/impl';

import { SetantaClient, SetantaClientImpl, SetantaClientConfig } from '@infrastructure/setanta-client';

@Module({
    imports: [GeneralConfigModule],
    providers: [
        {
            provide: Symbols.infrastructure.setantaClient.setantaClient,
            useFactory: (config: ConfigContainer<GeneralConfig>): SetantaClient => {
                const setantaClientConfig: SetantaClientConfig = {
                    endpoint: config.get('setanta.endpoint'),
                    apiKey: config.get('setanta.apiKey'),
                    bundleId: config.get('setanta.bundleId'),
                    timeout: config.get('setanta.timeout'),
                    certificateFileName: config.get('setanta.certificateFileName'),
                    keyFileName: config.get('setanta.keyFileName'),
                };

                return new SetantaClientImpl(setantaClientConfig);
            },
            inject: [Symbols.infrastructure.config.general],
        },
    ],
    exports: [Symbols.infrastructure.setantaClient.setantaClient],
})
export class SetantaClientModule {}