import { UseCase } from '@domain/_core';
import { UserSubscriptionUseCaseParams, UserSubscriptionUseCaseResponse } from '@useCases/processor/common';

export type SubscriptionCancelUseCaseParams = UserSubscriptionUseCaseParams;

export type SubscriptionCancelUseCaseResponse = UserSubscriptionUseCaseResponse;

export interface SubscriptionCancelUseCase extends UseCase<SubscriptionCancelUseCaseParams, SubscriptionCancelUseCaseResponse> {}