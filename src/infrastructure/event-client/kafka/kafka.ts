import { INestApplication, Inject, Injectable } from '@nestjs/common';
import { ClientKafka, KafkaOptions, MicroserviceOptions, Payload, Transport } from '@nestjs/microservices';
import { LogEntry, SASLOptions } from '@nestjs/microservices/external/kafka.interface';
import { Logger } from '@payme/logger';
import { Terminable as Terminatable } from '@payme/common';

import {
    PartialBy,
    Message,
    MessageKey,
    SubscriptionEnabledEventPayload,
    SubscriptionDisabledEventPayload,
} from '@domain/_core';

import { ConfigContainer } from '@payme/config-container';
import { GeneralConfig } from '@infrastructure/config/impl';
import {
    TerminatableEventProducer,
    Subscribable,
    SubscriptionId,
    KeyGenerator,
    APP_NAME,
    BasicEvent,
} from '@infrastructure/event-client/kafka';

export class BasicKafkaProducer implements Terminatable {
    constructor(
        private readonly kafkaClient: ClientKafka,
    ) {}

    async terminate(): Promise<void> {
        return await this.kafkaClient.close();
    }

    protected emit<TPayload extends object, TResult = object>(
        event: string,
        payload: Message<MessageKey<string>, TPayload>
    ): Subscribable<TResult> {
        return this.kafkaClient.emit(event, payload);
    }
}

@Injectable()
export class KafkaProducerImpl extends BasicKafkaProducer implements TerminatableEventProducer {
    private readonly serviceName = APP_NAME;

    constructor(
        private readonly config: ConfigContainer<GeneralConfig>,
        kafkaClient: ClientKafka,
        private readonly keyGenerator: KeyGenerator,
    ) {
        super(kafkaClient);
    }

    subscriptionEnabled(
        message: PartialBy<Message<MessageKey<SubscriptionId>, SubscriptionEnabledEventPayload>, 'key'>
    ): Subscribable<object> {
        const messageWithKey = this.addKey(message);

        const eventName: string = this.config.get('kafka.topics.subscription_enabled');

        const payload = {
            key: messageWithKey.key,
            value: this.makePayload(messageWithKey.value),
        };

        return this.emit(eventName, payload);
    }

    subscriptionDisabled(
        message: PartialBy<Message<MessageKey<SubscriptionId>, SubscriptionDisabledEventPayload>, 'key'>
    ): Subscribable<object> {
        const messageWithKey = this.addKey(message);

        const eventName: string = this.config.get('kafka.topics.subscription_disabled');

        const payload = {
            key: messageWithKey.key,
            value: this.makePayload(messageWithKey.value),
        };

        return this.emit(eventName, payload);
    }

    private addKey(
        message: PartialBy<Message<MessageKey<string>, object>, 'key'>
    ): Message<MessageKey<string>, object> {
        if (!message.key) {
            message.key = this.keyGenerator.generateKey();
        }

        return message as Message<MessageKey<string>, object>;
    }

    private makePayload<TPayload extends object>(payload: TPayload): TPayload & BasicEvent {
        return { ...payload, serviceName: this.serviceName };
    }
}

export class KafkaSetUpper {
    public static conncetKafkaStrategyToApp(
        app: INestApplication,
        config: ConfigContainer<GeneralConfig>,
        logger: Logger
    ) {
        app.connectMicroservice<MicroserviceOptions>(
            {
                transport: Transport.KAFKA,
                options: KafkaSetUpper.kafkaConsumerOptions(config, logger),
            },
            { inheritAppConfig: true }
        );
    }

    private static kafkaOptions(config: ConfigContainer<GeneralConfig>, logger: Logger): KafkaOptions['options'] {
        const sasl = config.get('kafka.sasl.enabled')
            ? {
                mechanism: config.get('kafka.sasl.mechanism'),
                username: config.get('kafka.sasl.username'),
                password: config.get('kafka.sasl.password'),
            }
            : undefined;

        const logCreator = () => {
            const infoLog = logger.info.bind(logger);
            return (entry: LogEntry): void => {
                const { namespace, label, log } = entry;
                infoLog(log.message, { namespace, label, ...log });
            };
        };

        return {
            client: {
                clientId: config.get('kafka.name'),
                brokers: config.get('kafka.brokers'),
                sasl: sasl as SASLOptions,
                ssl: config.get('kafka.ssl'),
                logCreator: logCreator,
                connectionTimeout: 30000,
            },
            consumer: {
                groupId: config.get('kafka.groupId'),
            },
        };
    }

    public static kafkaProducerOptions(
        config: ConfigContainer<GeneralConfig>,
        logger: Logger
    ): KafkaOptions['options'] {
        const basicOptions = this.kafkaOptions(config, logger);
        return {
            ...basicOptions,
            producerOnlyMode: true,
        };
    }

    public static kafkaConsumerOptions(
        config: ConfigContainer<GeneralConfig>,
        logger: Logger
    ): KafkaOptions['options'] {
        const basicOptions = this.kafkaOptions(config, logger);
        return {
            ...basicOptions,
            consumer: {
                groupId: config.get('kafka.groupId'),
            },
        };
    }
}