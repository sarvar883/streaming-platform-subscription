// import 'source-map-support/register';
import { NestFactory } from '@nestjs/core';

import { ProcessorContainer } from '@di/containers/processor';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(ProcessorContainer);
    app.enableShutdownHooks();

    await app.init();
}

bootstrap();