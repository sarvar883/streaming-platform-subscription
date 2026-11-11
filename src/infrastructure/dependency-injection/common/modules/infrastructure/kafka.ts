import { Module } from '@nestjs/common';
import { ClientKafka, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { Tokens } from '@payme/common';
import { Logger } from '@payme/logger';
import { Symbols } from '@di/common';
import { ConfigContainer } from '@payme/config-container';
import { GeneralConfig } from '@infrastructure/config/impl';
import {
    KafkaProducerImpl,
    KafkaSetUpper,
    KeyGenerator,
    TerminatableEventProducer,
    KafkaKeyGenerator,
} from '@infrastructure/event-client/kafka';

@Module({
    providers: [
        {
            provide: Symbols.infrastructure.kafka.kafkaClient,
            useFactory: (config: ConfigContainer<GeneralConfig>, logger: Logger) => {
                return ClientProxyFactory.create({
                    transport: Transport.KAFKA,
                    options: KafkaSetUpper.kafkaProducerOptions(config, logger),
                });
            },
            inject: [Symbols.infrastructure.config.general, Tokens.Logger],
        },
        {
            provide: Symbols.infrastructure.kafka.kafkaProducer,
            useFactory: (
                config: ConfigContainer<GeneralConfig>,
                kafkaClient: ClientKafka,
                keyGenerator: KeyGenerator,
            ): TerminatableEventProducer => {
                return new KafkaProducerImpl(config, kafkaClient, keyGenerator);
            },
            inject: [
                Symbols.infrastructure.config.general,
                Symbols.infrastructure.kafka.kafkaClient,
                Symbols.infrastructure.kafka.keyGenerator,
            ],
        },
        {
            provide: Symbols.infrastructure.kafka.keyGenerator,
            useFactory(config: ConfigContainer<GeneralConfig>) {
                return new KafkaKeyGenerator(config);
            },
            inject: [Symbols.infrastructure.config.general],
        },
    ],
    exports: [
        Symbols.infrastructure.kafka.kafkaClient,
        Symbols.infrastructure.kafka.kafkaProducer,
        Symbols.infrastructure.kafka.keyGenerator,
    ],
})
export class KafkaModule {}