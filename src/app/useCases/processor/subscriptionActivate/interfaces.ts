import { UseCase } from '@domain/_core';
import { UserSubscriptionUseCaseParams, UserSubscriptionUseCaseResponse } from '@useCases/processor/common';

export type SubscriptionActivateUseCaseParams = UserSubscriptionUseCaseParams;

export type SubscriptionActivateUseCaseResponse = UserSubscriptionUseCaseResponse;

export interface SubscriptionActivateUseCase extends UseCase<SubscriptionActivateUseCaseParams, SubscriptionActivateUseCaseResponse> {}

export type EnabledEventAdditionalData = {
    setantaActivationUrl: string;
}