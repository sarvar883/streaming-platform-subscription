import fs from 'fs';
import path from 'path';
import { Agent } from 'https';
import { HttpClient, RequestOptions, RequestAgentOption, HttpClientResponse } from '@payme/http-client';
import { AnyObject } from '@payme/common';

import { ActivationParams } from '@domain/setanta';
import {
    SetantaClientConfig,
    SetantaCertificatesNotFoundError,
    Country,
    Language,
    City,
    Files,
    ActivateRequestBody,
    ActivateResponseBody,
    CheckResponseBody,
    CancelResponseBody,
} from '@infrastructure/setanta-client';


export interface SetantaClient {
    getCheckRequestLogParams(setantaUserId: string): AnyObject;
    check(setantaUserId: string): Promise<HttpClientResponse<CheckResponseBody>>;

    getActivateRequestLogParams(params: ActivationParams): AnyObject;
    activate(params: ActivationParams): Promise<HttpClientResponse<ActivateResponseBody>>;

    getCancelRequestLogParams(subscriptionId: string): AnyObject;
    cancel(subscriptionId: string): Promise<HttpClientResponse<CancelResponseBody>>;
}


export class SetantaClientImpl implements SetantaClient {
    private readonly httpClient: HttpClient;
    private readonly httpsAgent: Agent;

    constructor(
        private readonly config: SetantaClientConfig,
    ) {
        this.httpClient = this.createHttpClient();
        this.httpsAgent = this.createHttpsAgent();
    }

    private createHttpClient(): HttpClient {
        const options: RequestOptions = {
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'api-secret-key': this.config.apiKey,
            },
            timeout: this.config.timeout,
        };

        return new HttpClient(options);
    }

    private loadCertificateFiles(): Files {
        try {
            const pathToFolder: string = path.resolve(__dirname, 'assets');

            return {
                certFile: fs.readFileSync(`${pathToFolder}/${this.config.certificateFileName}`),
                keyFile: fs.readFileSync(`${pathToFolder}/${this.config.keyFileName}`),
            };

        } catch (e) {
            throw new SetantaCertificatesNotFoundError();
        }
    }

    private createHttpsAgent(): Agent {
        const certificateFiles: Files = this.loadCertificateFiles();

        return new Agent({
            cert: certificateFiles.certFile,
            key: certificateFiles.keyFile,
        });
    }

    private getRequestOptions(): RequestAgentOption {
        return {
            agent: this.httpsAgent,
        };
    }

    private getCheckRequestUrl(setantaUserId: string): string {
        return `${this.config.endpoint}/api/accounts/${setantaUserId}`;
    }

    getCheckRequestLogParams(setantaUserId: string): AnyObject {
        return {
            method: 'get',
            url: this.getCheckRequestUrl(setantaUserId),
        };
    }

    async check(setantaUserId: string): Promise<HttpClientResponse<CheckResponseBody>> {
        const url: string = this.getCheckRequestUrl(setantaUserId);

        return await this.httpClient.get(url, this.getRequestOptions());
    }

    private getActivateRequestUrl(): string {
        return `${this.config.endpoint}/api/subscriptions`;
    }

    getActivateRequestLogParams(params: ActivationParams): AnyObject {
        return {
            method: 'post',
            url: this.getActivateRequestUrl(),
            body: this.createActivateRequestBody(params),
        };
    }

    async activate(params: ActivationParams): Promise<HttpClientResponse<ActivateResponseBody>> {
        const url: string = this.getActivateRequestUrl();

        const body: ActivateRequestBody = this.createActivateRequestBody(params);

        return await this.httpClient.post(url, body, this.getRequestOptions());
    }

    private createActivateRequestBody(params: ActivationParams): ActivateRequestBody {
        return {
            externalCustomerId: params.setantaUserId,
            bundleId: this.config.bundleId,
            enableSmsEmailLinkActivation: true,
            b2bProvidedUserAgent: null,
            b2bProvidedUserIp: null,
            email: null,
            phone: params.phone,
            purchaseId: params.subscriptionId,
            country: Country.Uzbekistan,
            language: Language.Russian,
            city: City.Tashkent,
            channel: 'Web',
        };
    }

    private getCancelRequestUrl(subscriptionId: string): string {
        return `${this.config.endpoint}/api/subscriptions/${subscriptionId}`;
    }

    getCancelRequestLogParams(subscriptionId: string): AnyObject {
        return {
            method: 'delete',
            url: this.getCancelRequestUrl(subscriptionId),
        };
    }

    async cancel(subscriptionId: string): Promise<HttpClientResponse<CancelResponseBody>> {
        const url: string = this.getCancelRequestUrl(subscriptionId);

        return await this.httpClient.delete(url, this.getRequestOptions());
    }
}