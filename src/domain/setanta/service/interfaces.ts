// ====================================
// Activate subscription
export type ActivationParams = {
    setantaUserId: string;
    // phone number must be in format: "+998991387056"
    phone: string;
    subscriptionId: string;
}

export type ActivateResponse = {
    success: true;
    data: {
        setantaSubscriptionId: string;
        setantaAccountActivationUrl: string;
        netflixAccountActivationUrl: string;
    };
}

// ====================================
// Check subscription
export type CheckParams = {
    setantaUserId: string;
}

export type CheckResponse = HasSubscriptionResponse | NoSubscriptionResponse;

export type HasSubscriptionResponse = {
    userHasActiveActivation: true;
    data: {
        setantaSubscriptionId: string;
        setantaAccountActivationUrl: string;
        netflixAccountActivationUrl: string;
    };
}

export type NoSubscriptionResponse = {
    userHasActiveActivation: false;
}

// ====================================
// Cancel subscription
export type CancelParams = {
    subscriptionId: string;
}

export type CancelResponse = {
    success: boolean;
}