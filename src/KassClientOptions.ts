export const NO_WEBCLIENT = 'NO_WEBCLIENT';
export const TOKEN_CANNOT_BE_NULL = 'TOKEN_CANNOT_BE_NULL';
export const INCORRECT_AMOUNT = 'INCORRECT_AMOUNT';
export const RECIPENT_SHOULD_BE_A_STRING = 'RECIPENT_SHOUL_BE_A_STRING';
export const NETWORK_ERROR = 'NETWORK_ERROR';
export const INVALID_DATA = 'INVALID_DATA';

export const KASS_STATUS = {
    PAID: 'paid' as const,
    REJECTED: 'rejected' as const,
    PENDING: 'pending' as const,
};

export type KASS_STATUS_PAID = typeof KASS_STATUS.PAID;
export type KASS_STATUS_REJECTED = typeof KASS_STATUS.REJECTED;
export type KASS_STATUS_PENDING = typeof KASS_STATUS.PENDING;

export interface KassClientOptions {
    token: string;
    url: string;
    timeBetweenPollingS: number;
}

export type KassClientProperties = Partial<Omit<KassClientOptions, 'token'>> &
    Required<Pick<KassClientOptions, 'token'>>;

export const DefaultProperties: Omit<KassClientOptions, 'token'> = {
    url: 'https://api.kass.is/v1/payments',
    timeBetweenPollingS: 10,
};

export type KassPaymentStatus = 'paid' | 'rejected';

export interface KassExpressClientProperties {
    absolutePath: string;
    relativePath: string;
}
