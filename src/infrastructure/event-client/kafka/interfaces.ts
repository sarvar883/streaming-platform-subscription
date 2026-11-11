import { Terminable as Terminatable } from '@payme/common';
import { EventProducer, MessageKey } from '@domain/_core';

export interface Subscribable<T> {
    subscribe(callback: (result: T) => void | Promise<void>): void;
}

export const APP_NAME = 'setanta-subscription-service';

export type BasicEvent = {
    serviceName: typeof APP_NAME;
};

export type SubscriptionId = `subscriptionId-${string}`;

export interface KeyGenerator {
    generateKey(): MessageKey<SubscriptionId>;
}

export interface TerminatableEventProducer extends EventProducer, Terminatable {}