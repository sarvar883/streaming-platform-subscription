export type CreateActivationParams = {
    setantaUserId: string;
    paymeSubscriptionId: string;
}

export type CheckActivationResponse = ActiveActivationFoundResponse | ActiveActivationNotFoundResponse;

export type ActiveActivationFoundResponse = {
    hasActiveActivation: true;
    activationId: string;
}

export type ActiveActivationNotFoundResponse = {
    hasActiveActivation: false;
}

export type ChangeStateAdditional = ActivationErrorData | ActivationSuccessData | CancelErrorData | {};

export type ActivationErrorData = {
    error: Record<string, any>;
}

export type ActivationSuccessData = {
    setantaSubscriptionId: string;
    setantaAccountActivationUrl: string | null;
    netflixAccountActivationUrl: string | null;
}

export type CancelErrorData = {
    error: Record<string, any>;
}