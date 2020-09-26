export interface KassPayment {
    amount: number;
    description?: string;
    image_url?: string;
    recipient: string;
    expires_in?: number;
    notify_url?: string;
    order?: string;
    terminal?: number;
}

export type KASS_PAYMENT_ERROR_CODES =
    | 'merchant_not_found'
    | 'merchant_account_locked'
    | 'merchant_signature_incorrect'
    | 'recipient_not_found'
    | 'merchant_cannot_be_recipient'
    | 'payment_not_found'
    | 'payment_exceeds_limits'
    | 'invalid_data'
    | 'system_error';

export interface KassPaymentResponseSuccess {
    success: true;
    id: string;
    created: number;
}

export interface KassPaymentResponseFailed {
    success: false;
    error: {
        code: string;
        key: KASS_PAYMENT_ERROR_CODES;
        message: string;
    };
}

export type KassPaymentResponse =
    | KassPaymentResponseSuccess
    | KassPaymentResponseFailed;

export const isKassPaymentResponseFailed = (
    data: KassPaymentResponse,
): data is KassPaymentResponseFailed =>
    typeof data == 'object' && !data.success;
