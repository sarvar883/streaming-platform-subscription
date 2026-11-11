import crypto from 'crypto';
import { ConfigContainer } from '@payme/config-container';

import { MessageKey } from '@domain/_core';
import { SubscriptionId, KeyGenerator } from '@infrastructure/event-client/kafka';
import { GeneralConfig } from '@infrastructure/config/impl';

export class KafkaKeyGenerator implements KeyGenerator {
    constructor(
        private readonly config: ConfigContainer<GeneralConfig>,
    ) {}

    generateKey(): MessageKey<SubscriptionId> {
        const instanceId = this.config.get('kafka.instanceId');
        return `${instanceId}:${crypto.randomBytes(16).toString('hex')}`;
    }
}
