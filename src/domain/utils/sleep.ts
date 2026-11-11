import { Milliseconds } from '@domain/_core';

export async function sleep(ms: Milliseconds) {
    return new Promise(resolve => setTimeout(resolve, ms));
}