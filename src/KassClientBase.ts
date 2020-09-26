import {
    DefaultProperties,
    KassClientProperties,
    TOKEN_CANNOT_BE_NULL,
} from './KassClientOptions';
import { isSSR } from './utils/isSSR';

export class KassClientBase {
    constructor(properties: KassClientProperties) {
        if (!isSSR()) {
            // Unsafe practice.
            throw new Error('Should not be used on web client or React Native');
        }
        const { token, url, timeBetweenPollingS } = {
            ...DefaultProperties,
            ...properties,
        };
        if (!token) {
            throw new Error(TOKEN_CANNOT_BE_NULL);
        }
        this._token = token;
        this._url = url;
        this._timeBetweenPollingS = timeBetweenPollingS;
    }

    private _token: string;
    get token(): string {
        return this._token;
    }
    private _url: string;
    get url(): string {
        return this._url;
    }
    get header(): Record<string, string> {
        return {
            Authorization: `Basic ${Buffer.from(
                `${this.token}:`,
                'utf-8',
            ).toString('base64')}`,
        };
    }
    private _timeBetweenPollingS: number;
    get timeBetweenPollingS(): number {
        return this._timeBetweenPollingS;
    }
}
