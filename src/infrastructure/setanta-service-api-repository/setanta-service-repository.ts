import { HttpClientError, HttpClientResponse } from '@payme/http-client';
import {
    SetantaActivationAlreadyExistsError,
    SetantaServiceUnavailableError,
    UnknownSetantaResponseError,
    UserNotFoundInSetantaError,
    SubscriptionNotFoundInSetantaError,
    ActivationParams,
    ActivateResponse,
    SetantaServiceRepository,
    CheckResponse,
    CancelResponse,
} from '@domain/setanta';
import {
    SubscriptionStatus,
    SetantaClient,
    ActivateResponseBody,
    CheckResponseBody,
    CancelResponseBody,
} from '@infrastructure/setanta-client';
import { RequestLogger, LogInsertResponse } from '@infrastructure/request-logger';


export class SetantaServiceAPIRepositoryImpl implements SetantaServiceRepository {
    constructor(
        private readonly setantaClient: SetantaClient,
        private readonly requestLogger: RequestLogger,
    ) {}

    public async check(setantaUserId: string): Promise<CheckResponse> {
        const logResponse: LogInsertResponse = await this.requestLogger.request({
            method: 'setanta_api_check',
            data: {
                setantaUserId,
                additional: this.setantaClient.getCheckRequestLogParams(setantaUserId),
            },
        });

        let response: CheckResponseBody;

        try {
            response = await this.withErrorHandling(
                () => this.setantaClient.check(setantaUserId),
                logResponse.request_id,
            );

        } catch (e) {
            if (
                e instanceof UserNotFoundInSetantaError ||
                e instanceof SubscriptionNotFoundInSetantaError
            ) {
                return {
                    userHasActiveActivation: false,
                };
            }

            throw e;
        }

        await this.requestLogger.response({
            request_id: logResponse.request_id,
            response,
        });

        if (response?.activeSubscription?.status === SubscriptionStatus.Active) {
            return {
                userHasActiveActivation: true,
                data: {
                    setantaSubscriptionId: response.activeSubscription.id,
                    setantaAccountActivationUrl: response.setantaAccountActivationUrl,
                    netflixAccountActivationUrl: response.netflixAccountActivationUrl || '',
                },
            };
        }

        if (!response?.activeSubscription) {
            return {
                userHasActiveActivation: false,
            };
        }

        throw new UnknownSetantaResponseError(response);
    }

    public async activate(params: ActivationParams): Promise<ActivateResponse> {
        const logResponse: LogInsertResponse = await this.requestLogger.request({
            method: 'setanta_api_activate',
            data: {
                params,
                additional: this.setantaClient.getActivateRequestLogParams(params),
            },
        });

        const response: ActivateResponseBody = await this.withErrorHandling(
            () => this.setantaClient.activate(params),
            logResponse.request_id,
        );

        await this.requestLogger.response({
            request_id: logResponse.request_id,
            response,
        });

        if (response?.status === SubscriptionStatus.Active) {
            return {
                success: true,
                data: {
                    setantaSubscriptionId: response.subscriptionId,
                    setantaAccountActivationUrl: response.setantaAccountActivationUrl,
                    netflixAccountActivationUrl: response.netflixAccountActivationUrl || '',
                },
            };
        }

        throw new UnknownSetantaResponseError(response);
    }

    public async cancel(subscriptionId: string): Promise<CancelResponse> {
        const logResponse: LogInsertResponse = await this.requestLogger.request({
            method: 'setanta_api_cancel',
            data: {
                subscriptionId,
                additional: this.setantaClient.getCancelRequestLogParams(subscriptionId),
            },
        });

        const response: CancelResponseBody = await this.withErrorHandling(
            () => this.setantaClient.cancel(subscriptionId),
            logResponse.request_id
        );

        await this.requestLogger.response({
            request_id: logResponse.request_id,
            response,
        });

        if (response?.status === SubscriptionStatus.Canceled) {
            return {
                success: true,
            };
        }

        throw new UnknownSetantaResponseError(response);
    }

    private mapError(e: HttpClientError): Error | null {
        const { status, body } = e.payload ?? {};

        if (body?.message === 'CUSTOMER_NOT_FOUND') {
            return new UserNotFoundInSetantaError();
        }

        if (status === 400 && body?.message === 'EXISTING_ACTIVE_SUBSCRIPTION') {
            return new SetantaActivationAlreadyExistsError();
        }

        if (body?.message === 'INVALID_SUBSCRIPTION_ID') {
            return new SubscriptionNotFoundInSetantaError();
        }

        return null;
    }

    private async withErrorHandling<T>(fn: () => Promise<HttpClientResponse<T>>, request_id: string): Promise<T> {
        try {
            const response = await fn();

            return response.body;

        } catch (e) {
            await this.requestLogger.error({ request_id, error: e });

            if (e instanceof HttpClientError) {
                const customError = this.mapError(e);
                if (customError) throw customError;
            }

            throw new SetantaServiceUnavailableError(e);
        }
    }
}