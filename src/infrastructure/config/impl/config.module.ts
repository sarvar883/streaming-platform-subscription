import { Module, DynamicModule, Provider } from '@nestjs/common';
import { ConfigTokens } from '@payme/nestjs-common';
import { ConfigContainer } from '@payme/config-container';
import {
    ConfigModuleOptions,
    ConfigModuleAsyncOptions,
} from '@infrastructure/config/types/config';


@Module({
    exports: [ConfigModule],
})
export class ConfigModule {
    public static forRootAsync<T>(options: ConfigModuleAsyncOptions<T>): DynamicModule {
        const asyncOptionsProvider = {
            provide: 'OPTIONS',
            useFactory: options.useFactory,
            inject: options.inject || [],
        };

        const configContainer: Provider = {
            provide: options.provide || ConfigContainer,
            useFactory: async (options: ConfigModuleOptions<T>) => {
                const container = new ConfigContainer(options.logger, {
                    ...options,
                });

                await container.start();

                return container;
            },
            inject: ['OPTIONS'],
        };

        const aliasConfigProvider: Provider = {
            provide: ConfigTokens.CONFIG_MODULE_PROVIDER,
            useExisting: options.provide,
        };

        return {
            module: ConfigModule,
            global: true,
            providers: [asyncOptionsProvider, configContainer, aliasConfigProvider],
            exports: [configContainer, aliasConfigProvider],
        };
    }
}