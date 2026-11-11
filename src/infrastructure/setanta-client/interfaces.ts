import { Milliseconds } from '@domain/_core';

export type SetantaClientConfig = {
    endpoint: string;
    apiKey: string;
    bundleId: string;
    timeout: Milliseconds;
    certificateFileName: string;
    keyFileName: string;
}

export enum SubscriptionStatus {
    Active = 'ACTIVE',
    Canceled = 'CANCELED',
}

export enum Country {
    Uzbekistan = 'UZ',
}

export enum Language {
    Uzbek = 'UZ',
    Russian = 'RU',
}

export enum City {
    Tashkent = 'Tashkent',
}

export type Files = {
    certFile: Buffer;
    keyFile: Buffer;
}

// ====================================
// Activate subscription
export type ActivateRequestBody = {
    externalCustomerId: string;
    bundleId: string;
    enableSmsEmailLinkActivation: boolean;
    b2bProvidedUserAgent: string | null;
    b2bProvidedUserIp: string | null;
    email: string | null;
    phone: string;
    purchaseId: string;
    country: Country;
    language: Language;
    city: string;
    channel: string;
}

export type ActivateResponseBody = {
    subscriptionId: string;
    status: SubscriptionStatus;
    createdAt: string;
    expDate: string;
    netflixAccountActivationUrl: string | null;
    setantaAccountActivationUrl: string;
}

// ====================================
// Check subscription
export type CheckResponseBody = {
    externalCustomerId: string;
    setantaAccountActivationUrl?: string;
    netflixAccountActivationUrl?: string;
    activeSubscription: ActiveSubscriptionDetails | null;
}

export type ActiveSubscriptionDetails = {
    id: string;
    status: SubscriptionStatus;
    bundleId: string;
    createdAt: string;
    expDate: string;
    netflixActivationStatus: string;
    setantaActivationStatus: string;
}

// ====================================
// Cancel subscription
export type CancelResponseBody = {
    status: SubscriptionStatus;
}