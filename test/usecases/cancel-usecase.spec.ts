import { SubscriptionCancelUseCase, SubscriptionCancelUseCaseImpl, SubscriptionCancelUseCaseParams } from '@useCases/processor/subscriptionCancel';
import { UserSubscriptionUseCaseSuccessResponse, UserSubscriptionUseCaseErrorResponse } from '@useCases/processor/common';
import { PaymeUser, PaymeUsersService, UserNotFoundError } from '@domain/payme-users';
import { SetantaUser, SetantaUsersService } from '@domain/setanta-users';
import { SetantaActivation, ActivationState, SetantaActivationsService } from '@domain/setanta-activations';
import { SetantaService } from '@domain/setanta';


describe('SubscriptionCancelUseCase', () => {
    let paymeUsersService: PaymeUsersService;
    let setantaUsersService: SetantaUsersService;
    let setantaActivationsService: SetantaActivationsService;
    let setantaService: SetantaService;

    let subscriptionCancelUseCase: SubscriptionCancelUseCase;

    beforeEach(() => {
        subscriptionCancelUseCase = new SubscriptionCancelUseCaseImpl(
            paymeUsersService,
            setantaUsersService,
            setantaActivationsService,
            setantaService,
        );
    });

    describe('execute', () => {
        const fakeParams: SubscriptionCancelUseCaseParams = {
            userId: '1',
            subscriptionId: '2',
        };

        const fakePaymeUser: PaymeUser = new PaymeUser({ id: 'fake_payme_user_id' } as any);

        const fakeSetantaUser: SetantaUser = new SetantaUser({ id: 'fake_setanta_user_id' } as any);

        const fakeSetantaActivation: SetantaActivation = new SetantaActivation({ id: 'fake_activation_id', } as any);

        const fakeSubscriptionData = {
            setantaSubscriptionId: 'some_id',
            setantaAccountActivationUrl: 'www.fake.url.com/1',
            netflixAccountActivationUrl: 'www.fake.url.com/2',
        };

        it('should respond with shouldRetry = true if cannot fetch payme user from Payme DB', async () => {
            paymeUsersService.getById = jest.fn().mockRejectedValue('some error');

            const useCaseResponse = await subscriptionCancelUseCase.execute(fakeParams) as UserSubscriptionUseCaseErrorResponse;

            expect(useCaseResponse).toBeDefined();
            expect(useCaseResponse.success).toBe(false);
            expect(useCaseResponse.shouldRetry).toBe(true);
        });

        it('should respond with shouldRetry = false if user with id not found in Payme DB', async () => {
            paymeUsersService.getById = jest.fn().mockRejectedValue(new UserNotFoundError());

            const useCaseResponse = await subscriptionCancelUseCase.execute(fakeParams) as UserSubscriptionUseCaseErrorResponse;

            expect(useCaseResponse).toBeDefined();
            expect(useCaseResponse.success).toBe(false);
            expect(useCaseResponse.shouldRetry).toBe(false);
        });

        it('should respond with shouldRetry = false if active activation for this user is not found in setanta DB', async () => {
            paymeUsersService.getById = jest.fn().mockReturnValue(fakePaymeUser);
            setantaUsersService.getOrCreateUser = jest.fn().mockReturnValue(fakeSetantaUser);
            setantaActivationsService.checkForActiveActivation = jest.fn().mockReturnValue({ hasActiveActivation: false });

            const useCaseResponse = await subscriptionCancelUseCase.execute(fakeParams) as UserSubscriptionUseCaseErrorResponse;

            expect(useCaseResponse).toBeDefined();
            expect(useCaseResponse.success).toBe(false);
            expect(useCaseResponse.shouldRetry).toBe(false);
        });

        it('should respond with shouldRetry = true if setanta check request resulted in error', async () => {
            paymeUsersService.getById = jest.fn().mockReturnValue(fakePaymeUser);
            setantaUsersService.getOrCreateUser = jest.fn().mockReturnValue(fakeSetantaUser);
            setantaActivationsService.checkForActiveActivation = jest.fn().mockReturnValue({ hasActiveActivation: true, activationId: '4' });
            setantaActivationsService.getById = jest.fn().mockReturnValue(fakeSetantaActivation);
            setantaService.checkSubscription = jest.fn().mockRejectedValue('some error');

            const useCaseResponse = await subscriptionCancelUseCase.execute(fakeParams) as UserSubscriptionUseCaseErrorResponse;

            expect(useCaseResponse).toBeDefined();
            expect(useCaseResponse.success).toBe(false);
            expect(useCaseResponse.shouldRetry).toBe(true);

            expect(setantaActivationsService.changeState).toHaveBeenCalled();
            expect(setantaActivationsService.changeState).toHaveBeenCalledWith(expect.anything(), ActivationState.ErrorWhileCancel, expect.anything());
        });

        it('should return success response if active subscription is not found in setanta', async () => {
            paymeUsersService.getById = jest.fn().mockReturnValue(fakePaymeUser);
            setantaUsersService.getOrCreateUser = jest.fn().mockReturnValue(fakeSetantaUser);
            setantaActivationsService.checkForActiveActivation = jest.fn().mockReturnValue({ hasActiveActivation: true, activationId: '4' });
            setantaActivationsService.getById = jest.fn().mockReturnValue(fakeSetantaActivation);
            setantaService.checkSubscription = jest.fn().mockReturnValue({ userHasActiveActivation: false });

            const useCaseResponse = await subscriptionCancelUseCase.execute(fakeParams) as UserSubscriptionUseCaseSuccessResponse;

            expect(useCaseResponse).toBeDefined();
            expect(useCaseResponse.success).toBe(true);
            expect(useCaseResponse.activationId).toBeDefined();
            expect(useCaseResponse.activationId.length).toBeDefined();
            expect(useCaseResponse.activationId.length).toBeGreaterThan(0);

            expect(setantaActivationsService.changeState).toHaveBeenCalled();
            expect(setantaActivationsService.changeState).toHaveBeenCalledWith(expect.anything(), ActivationState.Canceled);
        });

        it('should respond with shouldRetry = true if setanta cancel request resulted in error', async () => {
            paymeUsersService.getById = jest.fn().mockReturnValue(fakePaymeUser);
            setantaUsersService.getOrCreateUser = jest.fn().mockReturnValue(fakeSetantaUser);
            setantaActivationsService.checkForActiveActivation = jest.fn().mockReturnValue({ hasActiveActivation: true, activationId: '4' });
            setantaActivationsService.getById = jest.fn().mockReturnValue(fakeSetantaActivation);
            setantaService.checkSubscription = jest.fn().mockReturnValue({ userHasActiveActivation: true, data: fakeSubscriptionData });
            setantaService.cancelSubscription = jest.fn().mockRejectedValue('some error');

            const useCaseResponse = await subscriptionCancelUseCase.execute(fakeParams) as UserSubscriptionUseCaseErrorResponse;

            expect(useCaseResponse).toBeDefined();
            expect(useCaseResponse.success).toBe(false);
            expect(useCaseResponse.shouldRetry).toBe(true);

            expect(setantaActivationsService.changeState).toHaveBeenCalled();
            expect(setantaActivationsService.changeState).toHaveBeenCalledWith(expect.anything(), ActivationState.ErrorWhileCancel, expect.anything());
        });

        it('should return success response if cancel request to setanta was successful', async () => {
            paymeUsersService.getById = jest.fn().mockReturnValue(fakePaymeUser);
            setantaUsersService.getOrCreateUser = jest.fn().mockReturnValue(fakeSetantaUser);
            setantaActivationsService.checkForActiveActivation = jest.fn().mockReturnValue({ hasActiveActivation: true, activationId: '4' });
            setantaActivationsService.getById = jest.fn().mockReturnValue(fakeSetantaActivation);
            setantaService.checkSubscription = jest.fn().mockReturnValue({ userHasActiveActivation: true, data: fakeSubscriptionData });
            setantaService.cancelSubscription = jest.fn().mockReturnValue({ success: true });

            const useCaseResponse = await subscriptionCancelUseCase.execute(fakeParams) as UserSubscriptionUseCaseSuccessResponse;

            expect(useCaseResponse).toBeDefined();
            expect(useCaseResponse.success).toBe(true);
            expect(useCaseResponse.activationId).toBeDefined();
            expect(useCaseResponse.activationId.length).toBeDefined();
            expect(useCaseResponse.activationId.length).toBeGreaterThan(0);

            expect(setantaActivationsService.changeState).toHaveBeenCalled();
            expect(setantaActivationsService.changeState).toHaveBeenCalledWith(expect.anything(), ActivationState.Canceled);
        });
    });
});