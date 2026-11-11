import * as convict from 'convict';

import * as PaymeConfigContainer from '@payme/config-container';
import * as PaymeLogger from '@payme/logger';

export type ConfigModuleOptions<T> = {
    storage: PaymeConfigContainer.Storage;
    schema: convict.Schema<T>;
    logger: PaymeLogger.Logger;
};

export type ConfigModuleAsyncOptions<T> = {
    provide?: string | symbol;
    inject?: any[];
    useFactory?: (...args: any[]) => Promise<ConfigModuleOptions<T>> | ConfigModuleOptions<T>;
};