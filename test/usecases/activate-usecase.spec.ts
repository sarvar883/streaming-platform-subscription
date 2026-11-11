import { SubscriptionActivateUseCase, SubscriptionActivateUseCaseImpl, SubscriptionActivateUseCaseParams } from '@useCases/processor/subscriptionActivate';
import { UserSubscriptionUseCaseSuccessResponse, UserSubscriptionUseCaseErrorResponse } from '@useCases/processor/common';
import { PaymeUsersService, UserNotFoundError, UserPhoneNotFoundError } from '@domain/payme-users';
import { SetantaUser, SetantaUsersService } from '@domain/setanta-users';
import { SetantaActivation, ActivationState, SetantaActivationsService } from '@domain/setanta-activations';
import { SetantaService } from '@domain/setanta';


describe('SubscriptionActivateUseCase', () => {
    let paymeUsersService: PaymeUsersService;
    let setantaUsersService: SetantaUsersService;
    let setantaActivationsService: SetantaActivationsService;
    let setantaService: SetantaService;

    let subscriptionActivateUseCase: SubscriptionActivateUseCase;

    beforeEach(() => {
        subscriptionActivateUseCase = new SubscriptionActivateUseCaseImpl(
            paymeUsersService,
            setantaUsersService,
            setantaActivationsService,
            setantaService,
        );
    });

    describe('execute', () => {
        const fakeParams: SubscriptionActivateUseCaseParams = {
            userId: '1',
            subscriptionId: '2',
        };

        const fakePhoneNumber: string = '+998901234567';

        const fakeSetantaUser: SetantaUser = new SetantaUser({ id: '1' } as any);

        const fakeSubscriptionData = {
            setantaSubscriptionId: 'some_id',
            setantaAccountActivationUrl: 'www.fake.url.com/1',
            netflixAccountActivationUrl: 'www.fake.url.com/2',
        };

        const fakeSetantaActivation: SetantaActivation = new SetantaActivation({ id: 'fake_activation_id', } as any);

        it('should respond with shouldRetry = true if DbError happened while fetching user phone', async () => {
            paymeUsersService.getPhoneFromUserId = jest.fn().mockRejectedValue('some unknown error');

            const useCaseResponse = await subscriptionActivateUseCase.execute(fakeParams) as UserSubscriptionUseCaseErrorResponse;

            expect(useCaseResponse).toBeDefined();
            expect(useCaseResponse.success).toBe(false);
            expect(useCaseResponse.shouldRetry).toBe(true);
        });

        it('should respond with shouldRetry = false if user with given id not found in DB', async () => {
            paymeUsersService.getPhoneFromUserId = jest.fn().mockRejectedValue(new UserNotFoundError());

            const useCaseResponse = await subscriptionActivateUseCase.execute(fakeParams) as UserSubscriptionUseCaseErrorResponse;

            expect(useCaseResponse).toBeDefined();
            expect(useCaseResponse.success).toBe(false);
            expect(useCaseResponse.shouldRetry).toBe(false);
        });

        it('should respond with shouldRetry = false if user phone is not found', async () => {
            paymeUsersService.getPhoneFromUserId = jest.fn().mockRejectedValue(new UserPhoneNotFoundError());

            const useCaseResponse = await subscriptionActivateUseCase.execute(fakeParams) as UserSubscriptionUseCaseErrorResponse;

            expect(useCaseResponse).toBeDefined();
            expect(useCaseResponse.success).toBe(false);
            expect(useCaseResponse.shouldRetry).toBe(false);
        });

        it('should respond with shouldRetry = true if setantaUser is not created in DB', async () => {
            paymeUsersService.getPhoneFromUserId = jest.fn().mockReturnValue(fakePhoneNumber);
            setantaUsersService.getOrCreateUser = jest.fn().mockRejectedValue('some error');

            const useCaseResponse = await subscriptionActivateUseCase.execute(fakeParams) as UserSubscriptionUseCaseErrorResponse;

            expect(useCaseResponse).toBeDefined();
            expect(useCaseResponse.success).toBe(false);
            expect(useCaseResponse.shouldRetry).toBe(true);
        });

        it('should respond with shouldRetry = true if cannot check setanta activation in DB', async () => {
            paymeUsersService.getPhoneFromUserId = jest.fn().mockReturnValue(fakePhoneNumber);
            setantaUsersService.getOrCreateUser = jest.fn().mockReturnValue(fakeSetantaUser);
            setantaActivationsService.checkForActiveActivation = jest.fn().mockRejectedValue('some error');

            const useCaseResponse = await subscriptionActivateUseCase.execute(fakeParams) as UserSubscriptionUseCaseErrorResponse;

            expect(useCaseResponse).toBeDefined();
            expect(useCaseResponse.success).toBe(false);
            expect(useCaseResponse.shouldRetry).toBe(true);
        });

        it('should return success response if user already has active activation', async () => {
            paymeUsersService.getPhoneFromUserId = jest.fn().mockReturnValue(fakePhoneNumber);
            setantaUsersService.getOrCreateUser = jest.fn().mockReturnValue(fakeSetantaUser);
            setantaActivationsService.checkForActiveActivation = jest.fn().mockReturnValue({ hasActiveActivation: true, activationId: '1' });

            const useCaseResponse = await subscriptionActivateUseCase.execute(fakeParams) as UserSubscriptionUseCaseSuccessResponse;

            expect(useCaseResponse).toBeDefined();
            expect(useCaseResponse.success).toBe(true);
            expect(useCaseResponse.activationId).toBeDefined();
            expect(useCaseResponse.activationId.length).toBeDefined();
            expect(useCaseResponse.activationId.length).toBeGreaterThan(0);
        });

        it('should respond with shouldRetry = true if setanta activation is not created', async () => {
            paymeUsersService.getPhoneFromUserId = jest.fn().mockReturnValue(fakePhoneNumber);
            setantaUsersService.getOrCreateUser = jest.fn().mockReturnValue(fakeSetantaUser);
            setantaActivationsService.checkForActiveActivation = jest.fn().mockReturnValue({ hasActiveActivation: false });
            setantaActivationsService.create = jest.fn().mockRejectedValue('some error');

            const useCaseResponse = await subscriptionActivateUseCase.execute(fakeParams) as UserSubscriptionUseCaseErrorResponse;

            expect(useCaseResponse).toBeDefined();
            expect(useCaseResponse.success).toBe(false);
            expect(useCaseResponse.shouldRetry).toBe(true);
        });

        it('should return success response if setanta says the user has active subscription', async () => {
            paymeUsersService.getPhoneFromUserId = jest.fn().mockReturnValue(fakePhoneNumber);
            setantaUsersService.getOrCreateUser = jest.fn().mockReturnValue(fakeSetantaUser);
            setantaActivationsService.checkForActiveActivation = jest.fn().mockReturnValue({ hasActiveActivation: false });
            setantaActivationsService.create = jest.fn().mockReturnValue(fakeSetantaActivation);
            setantaService.checkSubscription = jest.fn().mockReturnValue({ userHasActiveActivation: true, data: fakeSubscriptionData });

            const useCaseResponse = await subscriptionActivateUseCase.execute(fakeParams) as UserSubscriptionUseCaseSuccessResponse;

            expect(useCaseResponse).toBeDefined();
            expect(useCaseResponse.success).toBe(true);
            expect(useCaseResponse.activationId).toBeDefined();
            expect(useCaseResponse.activationId.length).toBeDefined();
            expect(useCaseResponse.activationId.length).toBeGreaterThan(0);

            expect(setantaActivationsService.changeState).toHaveBeenCalled();
            expect(setantaActivationsService.changeState).toHaveBeenCalledWith('fake_activation_id', ActivationState.Active, fakeSubscriptionData);
        });

        it('should respond with shouldRetry = true if check request to setanta resulted in an error', async () => {
            paymeUsersService.getPhoneFromUserId = jest.fn().mockReturnValue(fakePhoneNumber);
            setantaUsersService.getOrCreateUser = jest.fn().mockReturnValue(fakeSetantaUser);
            setantaActivationsService.checkForActiveActivation = jest.fn().mockReturnValue({ hasActiveActivation: false });
            setantaActivationsService.create = jest.fn().mockReturnValue(fakeSetantaActivation);
            setantaService.checkSubscription = jest.fn().mockRejectedValue('some error');

            const useCaseResponse = await subscriptionActivateUseCase.execute(fakeParams) as UserSubscriptionUseCaseErrorResponse;

            expect(useCaseResponse).toBeDefined();
            expect(useCaseResponse.success).toBe(false);
            expect(useCaseResponse.shouldRetry).toBe(true);
            expect(useCaseResponse.activationId).toBeDefined();
            expect(useCaseResponse.activationId.length).toBeDefined();
            expect(useCaseResponse.activationId.length).toBeGreaterThan(0);

            expect(setantaActivationsService.changeState).toHaveBeenCalled();
            expect(setantaActivationsService.changeState).toHaveBeenCalledWith(expect.anything(), ActivationState.ErrorWhileActivation, expect.anything());
        });

        it('should return success response if setanta returned success response', async () => {
            paymeUsersService.getPhoneFromUserId = jest.fn().mockReturnValue(fakePhoneNumber);
            setantaUsersService.getOrCreateUser = jest.fn().mockReturnValue(fakeSetantaUser);
            setantaActivationsService.checkForActiveActivation = jest.fn().mockReturnValue({ hasActiveActivation: false });
            setantaActivationsService.create = jest.fn().mockReturnValue(fakeSetantaActivation);
            setantaService.checkSubscription = jest.fn().mockReturnValue({ userHasActiveActivation: false });
            setantaService.activateSubscription = jest.fn().mockReturnValue({ success: true, data: fakeSubscriptionData });

            const useCaseResponse = await subscriptionActivateUseCase.execute(fakeParams) as UserSubscriptionUseCaseSuccessResponse;

            expect(useCaseResponse).toBeDefined();
            expect(useCaseResponse.success).toBe(true);
            expect(useCaseResponse.activationId).toBeDefined();
            expect(useCaseResponse.activationId.length).toBeDefined();
            expect(useCaseResponse.activationId.length).toBeGreaterThan(0);

            expect(setantaActivationsService.changeState).toHaveBeenCalled();
            expect(setantaActivationsService.changeState).toHaveBeenCalledWith(expect.anything(), ActivationState.Active, expect.anything());
        });

        it('should respond with shouldRetry = true if activation request to setanta resulted in an error', async () => {
            paymeUsersService.getPhoneFromUserId = jest.fn().mockReturnValue(fakePhoneNumber);
            setantaUsersService.getOrCreateUser = jest.fn().mockReturnValue(fakeSetantaUser);
            setantaActivationsService.checkForActiveActivation = jest.fn().mockReturnValue({ hasActiveActivation: false });
            setantaActivationsService.create = jest.fn().mockReturnValue(fakeSetantaActivation);
            setantaService.checkSubscription = jest.fn().mockReturnValue({ userHasActiveActivation: false });
            setantaService.activateSubscription = jest.fn().mockRejectedValue('some error');

            const useCaseResponse = await subscriptionActivateUseCase.execute(fakeParams) as UserSubscriptionUseCaseErrorResponse;

            expect(useCaseResponse).toBeDefined();
            expect(useCaseResponse.success).toBe(false);
            expect(useCaseResponse.shouldRetry).toBe(true);
            expect(useCaseResponse.activationId).toBeDefined();
            expect(useCaseResponse.activationId.length).toBeDefined();
            expect(useCaseResponse.activationId.length).toBeGreaterThan(0);

            expect(setantaActivationsService.changeState).toHaveBeenCalled();
            expect(setantaActivationsService.changeState).toHaveBeenCalledWith(expect.anything(), ActivationState.ErrorWhileActivation, expect.anything());
        });
    });
});