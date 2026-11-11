import path from 'path';
import { OnModuleInit } from '@nestjs/common';
import { Terminable as Terminatable } from '@payme/common';
import { Logger } from '@payme/logger';
import { WorkerPool, WorkerPoolConfigs } from '@infrastructure/worker-pool';
import { QueueFullError } from '@infrastructure/queue';


export class TinyWorkerPool implements WorkerPool, Terminatable, OnModuleInit {
    private pool;
    private isTerminating: boolean;

    constructor(
        private readonly config: WorkerPoolConfigs,
        private readonly logger: Logger,
    ) {
        this.isTerminating = false;
    }

    async onModuleInit(): Promise<void> {
        await this.initialize();
    }

    private async initialize(): Promise<void> {
        const { default: Tinypool } = await import('tinypool');

        this.pool = new Tinypool({
            runtime: 'child_process',
            filename: path.resolve(__dirname, this.config.filename),
            minThreads: Math.floor(this.config.processesCount / 2),
            maxThreads: this.config.processesCount,
            idleTimeout: this.config.idleTimeout,
            maxQueue: this.config.maxQueue,
            terminateTimeout: 30000,
        });
    }

    async run(taskId: string) {
        this.logger.info('Run task: ' + taskId);
        this.logger.info('Threads: ' + this.pool.threads.length);
        this.logger.info('queueSize: ' + this.pool.queueSize);
        this.logger.info('queueLimit: ' + this.pool.options.maxQueue);

        if (this.pool.queueSize < this.pool.options.maxQueue) {
            return this.pool.run(taskId);
        } else {
            return Promise.reject(new QueueFullError());
        }
    }

    acceptsTasks(): boolean {
        if (this.isTerminating) {
           return false;
        }

        return this.pool.queueSize === 0 || this.pool.queueSize < this.pool.options.maxQueue;
    }

    async terminate(): Promise<void> {
        this.isTerminating = true;
        await this.pool.destroy();
    }
}