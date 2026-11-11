// import 'source-map-support/register';
import { NestFactory } from '@nestjs/core';
import { ConfigurableEventPatternProcessorService } from '@payme/nestjs-communication-utils';

import { ConfigContainer } from '@payme/config-container';
import { GeneralConfig } from '@infrastructure/config/impl';
import { Symbols } from '@di/common';
import { Logger } from '@payme/logger';
import { Tokens } from '@payme/common';

import { ReplicatorContainer } from '@di/containers/replicator';
import { KafkaSetUpper } from '@infrastructure/event-client/kafka';
import { ReplicatorEventController } from '@infrastructure/controllers/replicator/replicatorEventController';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(ReplicatorContainer);
    app.enableShutdownHooks();

    const config = app.get<ConfigContainer<GeneralConfig>>(Symbols.infrastructure.config.general);
    const logger = app.get<Logger>(Tokens.Logger);

    const eventPatternsProcessor = app.get(ConfigurableEventPatternProcessorService);
    eventPatternsProcessor.process([ReplicatorEventController]);

    KafkaSetUpper.conncetKafkaStrategyToApp(app, config, logger);

    await app.startAllMicroservices();
    await app.init();
}

bootstrap();