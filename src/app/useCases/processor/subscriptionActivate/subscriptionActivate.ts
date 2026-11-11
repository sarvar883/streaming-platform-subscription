import { AnyObject } from '@payme/common';
import {
    SubscriptionActivateUseCase,
    SubscriptionActivateUseCaseParams,
    SubscriptionActivateUseCaseResponse,
    EnabledEventAdditionalData,
} from '@useCases/processor/subscriptionActivate';

import { EventProducer, SubscriptionEnabledEventPayload } from '@domain/_core';
import { PaymeUsersService, UserNotFoundError, UserPhoneNotFoundError } from '@domain/payme-users';
import { SetantaUser, SetantaUsersService } from '@domain/setanta-users';
import { SetantaActivation, ActivationState, SetantaActivationsService, CheckActivationResponse } from '@domain/setanta-activations';
import { SetantaService, CheckResponse, ActivateResponse, UnknownSetantaResponseError } from '@domain/setanta';

export class SubscriptionActivateUseCaseImpl implements SubscriptionActivateUseCase {
    constructor(
        private readonly paymeUsersService: PaymeUsersService,
        private readonly setantaUsersService: SetantaUsersService,
        private readonly setantaActivationsService: SetantaActivationsService,
        private readonly setantaService: SetantaService,
        private readonly producer: EventProducer,
    ) {}

    async execute(params: SubscriptionActivateUseCaseParams): Promise<SubscriptionActivateUseCaseResponse> {
        const paymeUserId: string = params.userId;
        const paymeSubscriptionId: string = params.subscriptionId;

        let activation: SetantaActivation = null;
        let activationId: string = null;

        try {
            const phone: string = await this.paymeUsersService.getPhoneFromUserId(paymeUserId);

            const setantaUser: SetantaUser = await this.setantaUsersService.getOrCreateUser(paymeUserId);
            const setantaUserId: string = setantaUser.id;

            const checkActivationResponse: CheckActivationResponse = await this.setantaActivationsService.checkForActiveActivation(setantaUserId);

            if (checkActivationResponse.hasActiveActivation) {
                return {
                    success: true,
                    activationId: checkActivationResponse.activationId,
                };
            }

            activation = await this.setantaActivationsService.create({ setantaUserId, paymeSubscriptionId });
            activationId = activation.id;

            const setantaCheckResponse: CheckResponse = await this.setantaService.checkSubscription({ setantaUserId });

            if (setantaCheckResponse.userHasActiveActivation) {
                await this.setantaActivationsService.changeState(activation, ActivationState.Active, setantaCheckResponse.data);

                this.sendSubscriptionEnabledEvent(params, { setantaActivationUrl: setantaCheckResponse.data.setantaAccountActivationUrl });

                return {
                    success: true,
                    activationId,
                };
            }

            const setantaActivationResponse: ActivateResponse = await this.setantaService.activateSubscription({
                setantaUserId,
                phone,
                subscriptionId: paymeSubscriptionId,
            });

            if (setantaActivationResponse.success) {
                await this.setantaActivationsService.changeState(activation, ActivationState.Active, setantaActivationResponse.data);

                this.sendSubscriptionEnabledEvent(params, { setantaActivationUrl: setantaActivationResponse.data.setantaAccountActivationUrl });

                return {
                    success: true,
                    activationId,
                };
            }

            throw new UnknownSetantaResponseError(setantaActivationResponse);

        } catch (e) {
            if (activation && activation instanceof SetantaActivation) {
                await this.setantaActivationsService.changeState(activation, ActivationState.ErrorWhileActivation, { error: this.getDefaultError(e) });
            }

            return this.handleError(e, activationId);
        }
    }

    private handleError(e, activationId: string | null): SubscriptionActivateUseCaseResponse {
        if (
            e instanceof UserNotFoundError ||
            e instanceof UserPhoneNotFoundError
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

    private sendSubscriptionEnabledEvent(params: SubscriptionActivateUseCaseParams, additional: EnabledEventAdditionalData): void {
        const payload: SubscriptionEnabledEventPayload = {
            subscriptionId: params.subscriptionId,
            userId: params.userId,
            params: {
                setantaActivationUrl: additional.setantaActivationUrl,
            },
        };

        this.producer.subscriptionEnabled({ value: payload });
    }

    private returnErrorResponse({ activationId, shouldRetry, message, errorData = null }): SubscriptionActivateUseCaseResponse {
        return {
            success: false,
            activationId: activationId || null,
            shouldRetry,
            error: {
                message,
                data: errorData,
            },
        };
    }
}