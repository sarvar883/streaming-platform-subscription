import { AnyObject } from '@payme/common';

export type UserSubscriptionUseCaseParams = {
    userId: string;
    subscriptionId: string;
}

export type UserSubscriptionUseCaseResponse = UserSubscriptionUseCaseSuccessResponse | UserSubscriptionUseCaseErrorResponse;

export type UserSubscriptionUseCaseSuccessResponse = {
    success: true;
    activationId: string;
}

export type UserSubscriptionUseCaseErrorResponse = {
    success: false;
    activationId: string | null;
    shouldRetry: boolean;
    error: {
        message: string;
        data: AnyObject;
    };
}