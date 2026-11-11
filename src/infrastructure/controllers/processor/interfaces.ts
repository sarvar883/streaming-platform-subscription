import { Milliseconds } from '@domain/_core';

export type ProcessorConfigs = {
    sleepTimeBetweenTasks: Milliseconds;
    sleepTimeOnFullQueue: Milliseconds;
    sleepTimeOnEmptyQueue: Milliseconds;
}