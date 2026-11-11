import { AnyObject } from '@payme/common';
import {
    SubscriptionCancelUseCase,
    SubscriptionCancelUseCaseParams,
    SubscriptionCancelUseCaseResponse,
} from '@useCases/processor/subscriptionCancel';

import { EventProducer, SubscriptionDisabledEventPayload } from '@domain/_core';
import { PaymeUsersService, PaymeUser, UserNotFoundError } from '@domain/payme-users';
import { SetantaUser, SetantaUsersService } from '@domain/setanta-users';
import {
    SetantaActivation,
    SetantaActivationsService,
    CheckActivationResponse,
    ActiveActivationNotFoundError,
    ActivationState,
} from '@domain/setanta-activations';
import { SetantaService, CheckResponse, CancelResponse, UnknownSetantaResponseError } from '@domain/setanta';


export class SubscriptionCancelUseCaseImpl implements SubscriptionCancelUseCase {
    constructor(
        private readonly paymeUsersService: PaymeUsersService,
        private readonly setantaUsersService: SetantaUsersService,
        private readonly setantaActivationsService: SetantaActivationsService,
        private readonly setantaService: SetantaService,
        private readonly producer: EventProducer,
    ) {}

    async execute(params: SubscriptionCancelUseCaseParams): Promise<SubscriptionCancelUseCaseResponse> {
        const paymeUserId: string = params.userId;
        const paymeSubscriptionId: string = params.subscriptionId;

        let activation: SetantaActivation = null;
        let activationId: string = null;

        try {
            const paymeUser: PaymeUser = await this.paymeUsersService.getById(paymeUserId);

            const setantaUser: SetantaUser = await this.setantaUsersService.getOrCreateUser(paymeUser.id);
            const setantaUserId: string = setantaUser.id;

            const checkActivationResponse: CheckActivationResponse = await this.setantaActivationsService.checkForActiveActivation(setantaUserId);

            if (!checkActivationResponse.hasActiveActivation) {
                throw new ActiveActivationNotFoundError();
            }

            activationId = checkActivationResponse.activationId;
            activation = await this.setantaActivationsService.getById(activationId);

            const setantaCheckResponse: CheckResponse = await this.setantaService.checkSubscription({ setantaUserId });

            if (!setantaCheckResponse.userHasActiveActivation) {
                await this.setantaActivationsService.changeState(activation, ActivationState.Canceled);

                this.sendSubscriptionDisabledEvent(params);

                return {
                    success: true,
                    activationId,
                };
            }

            const setantaCancelResponse: CancelResponse = await this.setantaService.cancelSubscription({
                subscriptionId: activation.setantaSubscriptionId,
            });

            if (setantaCancelResponse.success) {
                await this.setantaActivationsService.changeState(activation, ActivationState.Canceled);

                this.sendSubscriptionDisabledEvent(params);

                return {
                    success: true,
                    activationId,
                };
            }

            throw new UnknownSetantaResponseError(setantaCancelResponse);

        } catch (e) {
            if (activation && activation instanceof SetantaActivation) {
                await this.setantaActivationsService.changeState(activation, ActivationState.ErrorWhileCancel, { error: this.getDefaultError(e) });
            }

            return this.handleError(e, activationId);
        }
    }

    private handleError(e, activationId: string | null): SubscriptionCancelUseCaseResponse {
        if (
            e instanceof UserNotFoundError ||
            e instanceof ActiveActivationNotFoundError
        ) {
            return this.returnErrorResponse({ activationId, shouldRetry: false, message: this.getErrorMessage(e) });
        }

        return this.returnErrorResponse({ activationId, shouldRetry: true, message: this.getErrorMessage(e), errorData: this.getDefaultError(e) });
    }

    private getErrorMessage(e: AnyObject): string {
        return e?.constructor?.name || 'UnknownError';
    }

    private getDefaultError(e: AnyObject) {
        return {
            code: e?.code || null,
            message: e?.multiLangMessage?.ru || e?.message || 'Unknown message',
            data: e?.data || null,
        };
    }

    private sendSubscriptionDisabledEvent(params: SubscriptionCancelUseCaseParams): void {
        const payload: SubscriptionDisabledEventPayload = {
            subscriptionId: params.subscriptionId,
            userId: params.userId,
        };

        this.producer.subscriptionDisabled({ value: payload });
    }

    private returnErrorResponse({ activationId, shouldRetry, message, errorData = null }): SubscriptionCancelUseCaseResponse {
        return {
            success: false,
            activationId: activationId || null,
            shouldRetry,
            error: {
                message,
                data: errorData || null,
            },
        };
    }
}