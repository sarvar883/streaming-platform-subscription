import { Milliseconds } from '@domain/_core';

export type WorkerPoolConfigs = {
    filename: string;
    processesCount: number;
    idleTimeout: Milliseconds;
    maxQueue: number;
}