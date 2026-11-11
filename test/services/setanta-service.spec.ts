import { HttpClientError, HttpClientResponse } from '@payme/http-client';
import {
    ExistingActiveSubscriptionError,
    SetantaServiceUnavailableError,
    UnknownSetantaResponseError,
} from '@domain/errors';
import {
    SetantaService,
    SetantaServiceImpl,
    CheckResponse,
    ActivateResponse,
    HasSubscriptionResponse,
    NoSubscriptionResponse,
} from '@domain/setanta';
import { SetantaClient } from '@infrastructure/setanta-client';
import {
    checkSuccessMock,
    checkNoActiveSubscriptionMock,
    checkUnknownResponseMock,
    activateSuccessMock,
    activateUnknownResponseMock,
    cancelSuccessMock,
    cancelUnknownResponseMock,
} from '../mocks/entity/setanta-client';


describe('SetantaService', () => {
    let setantaService: SetantaService;
    let setantaClient: SetantaClient;

    beforeEach(() => {
        setantaClient = {
            check: jest.fn(),
            activate: jest.fn(),
            cancel: jest.fn(),
        };

        setantaService = new SetantaServiceImpl(setantaClient);
    });

    describe('checkSubscription', () => {
        const fakeCheckParams = {
            setantaUserId: '36a220d193e8191994e8214a',
        };

        it('should return success response if user already has active activation', async () => {
            setantaClient.check = jest.fn().mockReturnValue(checkSuccessMock);

            const result = await setantaService.checkSubscription(fakeCheckParams) as HasSubscriptionResponse;

            expect(setantaClient.check).toHaveBeenCalled();
            expect(result).toBeDefined();
            expect(result.userHasActiveActivation).toBe(true);
            expect(result.data).toBeDefined();
            expect(result.data.setantaAccountActivationUrl).toBeDefined();
            expect(result.data.setantaAccountActivationUrl.length).toBeGreaterThan(0);
        });

        it('should return response that user does not have active subscription', async () => {
            setantaClient.check = jest.fn().mockReturnValue(checkNoActiveSubscriptionMock);

            const result = await setantaService.checkSubscription(fakeCheckParams) as NoSubscriptionResponse;

            expect(setantaClient.check).toHaveBeenCalled();
            expect(result).toBeDefined();
            expect(result.userHasActiveActivation).toBe(false);
        });

        it('should throw UnknownSetantaResponseError if something weird was received from Setanta', async () => {
            setantaClient.check = jest.fn().mockReturnValue(checkUnknownResponseMock);

            try {
                const result = await setantaService.checkSubscription(fakeCheckParams);
            } catch (e) {
                expect(setantaClient.check).toHaveBeenCalled();
                expect(e).toBeInstanceOf(UnknownSetantaResponseError);
            }
        });

        it('should return response that user does not have active subscription if CUSTOMER_NOT_FOUND was received from Setanta', async () => {
            const errorPayload = {
                body: {
                    message: 'CUSTOMER_NOT_FOUND',
                },
            } as HttpClientResponse;

            setantaClient.check = jest.fn().mockRejectedValue(new HttpClientError('Some fake error', errorPayload));

            const result = await setantaService.checkSubscription(fakeCheckParams);

            expect(setantaClient.check).toHaveBeenCalled();
            expect(result).toBeDefined();
            expect(result.userHasActiveActivation).toBe(false);
        });

        it('should throw SetantaServiceUnavailableError when if setantaClient throws some error', async () => {
            setantaClient.check = jest.fn().mockRejectedValue(new Error('Some fake error'));

            try {
                const result = await setantaService.checkSubscription(fakeCheckParams);
            } catch (e) {
                expect(setantaClient.check).toHaveBeenCalled();
                expect(e).toBeInstanceOf(SetantaServiceUnavailableError);
            }
        });
    });

    describe('activateSubscription', () => {
        const fakeActivateParams = {
            setantaUserId: '66a220d193e8191994e8214a',
            phone: '+998941234567',
            subscriptionId: '4403126f-a227-4a07-a524-ba6711631835',
        };

        it('should return success response if everything is right', async () => {
            setantaClient.activate = jest.fn().mockReturnValue(activateSuccessMock);

            const result = await setantaService.activateSubscription(fakeActivateParams);

            expect(setantaClient.activate).toHaveBeenCalled();
            expect(result).toBeDefined();
            expect(result.success).toBe(true);
            expect(result.data).toBeDefined();
            expect(result.data.setantaSubscriptionId).toBeDefined();
            expect(result.data.setantaSubscriptionId.length).toBeGreaterThan(0);
            expect(result.data.setantaAccountActivationUrl).toBeDefined();
            expect(result.data.setantaAccountActivationUrl.length).toBeGreaterThan(0);
        });

        it('should return UnknownSetantaResponseError if something weird was received from Setanta', async () => {
            setantaClient.activate = jest.fn().mockReturnValue(activateUnknownResponseMock);

            try {
                const result = await setantaService.activateSubscription(fakeActivateParams);
            } catch (e) {
                expect(setantaClient.activate).toHaveBeenCalled();
                expect(e).toBeInstanceOf(UnknownSetantaResponseError);
            }
        });

        it('should throw ExistingActiveSubscriptionError if user already has active subscription but 2 send activate request again', async () => {
            const errorPayload = {
                status: 400,
                body: {
                    message: 'EXISTING_ACTIVE_SUBSCRIPTION',
                },
            } as HttpClientResponse;

            setantaClient.activate = jest.fn().mockRejectedValue(new HttpClientError('Some fake error', errorPayload));

            try {
                const result = await setantaService.activateSubscription(fakeActivateParams);
            } catch (e) {
                expect(setantaClient.activate).toHaveBeenCalled();
                expect(e).toBeInstanceOf(ExistingActiveSubscriptionError);
            }
        });

        it('should throw SetantaServiceUnavailableError if setantaClient throws some error', async () => {
            setantaClient.activate = jest.fn().mockRejectedValue(new Error('Some fake error'));

            try {
                const result = await setantaService.activateSubscription(fakeActivateParams);
            } catch (e) {
                expect(setantaClient.activate).toHaveBeenCalled();
                expect(e).toBeInstanceOf(SetantaServiceUnavailableError);
            }
        });
    });

    describe('cancelSubscription', () => {
        const fakeCancelParams = {
            subscriptionId: '4403126f-a227-4a07-a524-ba6711631835',
        };

        it('should return success response if everything is right', async () => {
            setantaClient.cancel = jest.fn().mockReturnValue(cancelSuccessMock);

            const result = await setantaService.cancelSubscription(fakeCancelParams);

            expect(setantaClient.cancel).toHaveBeenCalled();
            expect(result).toBeDefined();
            expect(result.success).toBe(true);
        });

        it('should throw UnknownSetantaResponseError if something weird was received from Setanta', async () => {
            setantaClient.cancel = jest.fn().mockReturnValue(cancelUnknownResponseMock);

            try {
                const result = await setantaService.cancelSubscription(fakeCancelParams);
            } catch (e) {
                expect(setantaClient.cancel).toHaveBeenCalled();
                expect(e).toBeInstanceOf(UnknownSetantaResponseError);
            }
        });

        it('should throw SetantaServiceUnavailableError if setantaClient throws some error', async () => {
            setantaClient.cancel = jest.fn().mockRejectedValue(new Error('Some fake error'));

            try {
                const result = await setantaService.cancelSubscription(fakeCancelParams);
            } catch (e) {
                expect(setantaClient.cancel).toHaveBeenCalled();
                expect(e).toBeInstanceOf(SetantaServiceUnavailableError);
            }
        });
    });
});