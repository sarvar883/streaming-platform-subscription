import { AnyObject } from '@payme/common';
import { HttpClientResponse } from '@payme/http-client';
import {
    SubscriptionStatus,
    CheckResponseBody,
    ActivateResponseBody,
    CancelResponseBody,
} from '@infrastructure/setanta-client';


// Check Mocks
export const checkSuccessMock: HttpClientResponse<CheckResponseBody> = {
    status: 200,
    body: {
        externalCustomerId: '66a220d193e8191994e8214a',
        setantaAccountActivationUrl: 'https://redirect.middleware.setantasports.com/links/d57e1b3e33/',
        activeSubscription: {
            id: '5cb0a84c-cdbc-484f-908e-237e76ef176e',
            status: SubscriptionStatus.Active,
            bundleId: 'e4fa7581-9413-498e-b2a3-b73e37d0c639',
            createdAt: '2024-08-26T07:38:45.569Z',
            expDate: '2024-09-25T07:38:45.569Z',
            netflixActivationStatus: 'PENDING',
            setantaActivationStatus: 'PENDING'
        },
    },
    headers: {},
    url: '',
};

export const checkNoActiveSubscriptionMock: HttpClientResponse<CheckResponseBody> = {
    status: 200,
    body: {
        externalCustomerId: '36a220d193e8191994e8214a',
        activeSubscription: null,
    },
    headers: {},
    url: '',
};

export const checkUnknownResponseMock: HttpClientResponse<AnyObject> = {
    status: 200,
    body: {
        externalCustomerId: '36a220d193e8191994e8214a',
        activeSubscription: {
            status: 'SOME_UNKNOWN_STATUS',
        },
    },
    headers: {},
    url: '',
};


// Activate Mocks
export const activateSuccessMock: HttpClientResponse<ActivateResponseBody> = {
    status: 201,
    body: {
        subscriptionId: '66a220d193e8191994e8214a',
        status: SubscriptionStatus.Active,
        createdAt: '2024-08-26T07:38:45.569Z',
        expDate: '2024-09-25T07:38:45.569Z',
        netflixAccountActivationUrl: null,
        setantaAccountActivationUrl: 'https://redirect.middleware.setantasports.com/links/d57e1b3e33/',
    },
    headers: {},
    url: '',
};

export const activateUnknownResponseMock: HttpClientResponse<AnyObject> = {
    status: 201,
    body: {
        subscriptionId: '66a220d193e8191994e8214a',
        status: 'UNKNOWN_STATUS',
    },
    headers: {},
    url: '',
};


// Cancel mocks
export const cancelSuccessMock: HttpClientResponse<CancelResponseBody> = {
    status: 200,
    body: {
        status: SubscriptionStatus.Canceled,
    },
    headers: {},
    url: '',
};

export const cancelUnknownResponseMock: HttpClientResponse<AnyObject> = {
    status: 200,
    body: {
        status: 'UNKNOWN_STATUS',
    },
    headers: {},
    url: '',
};