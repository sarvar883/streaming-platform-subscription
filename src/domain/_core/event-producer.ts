import { PartialBy, Message, MessageKey } from '@domain/_core';
import { Subscribable, SubscriptionId } from '@infrastructure/event-client/kafka';

export interface EventProducer {
    subscriptionEnabled(
        payload: PartialBy<Message<MessageKey<SubscriptionId>, SubscriptionEnabledEventPayload>, 'key'>
    ): Subscribable<object>;

    subscriptionDisabled(
        payload: PartialBy<Message<MessageKey<SubscriptionId>, SubscriptionDisabledEventPayload>, 'key'>
    ): Subscribable<object>;
}

export type SubscriptionEnabledEventPayload = {
    subscriptionId: string;
    userId: string;
    params: {
        setantaActivationUrl: string;
    };
}

export type SubscriptionDisabledEventPayload = {
    subscriptionId: string;
    userId: string;
}