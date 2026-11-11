// import 'source-map-support/register';
import { NestFactory } from '@nestjs/core';
import { Tokens } from '@payme/common';
import { Logger } from '@payme/logger';
import { Symbols } from '@di/common';

import { AppModule } from '@services/worker/app.module';
import { WorkerFunction } from '@services/worker/interfaces';
import { TaskProcessor } from '@infrastructure/controllers/task/task-processor';

async function startWorker(): Promise<WorkerFunction> {
    const app = await NestFactory.create(AppModule);

    const taskProcessor: TaskProcessor = app.get(Symbols.infrastructure.controllers.TaskProcessor);
    const logger: Logger = app.get(Tokens.Logger);

    await app.init();

    logger.info('[worker] Worker started');

    return async (taskId: string): Promise<void> => {
        try {
            await taskProcessor.run(taskId);
        } catch (error) {
            logger.error(`[worker] Error on running task: ${taskId}`);
            console.log(error);
        }
    };
}

export default startWorker();