import fetch from 'node-fetch';

import { KassClientBase } from './KassClientBase';
import {
    INCORRECT_AMOUNT,
    KASS_STATUS,
    KassPaymentStatus,
    RECIPENT_SHOULD_BE_A_STRING,
} from './KassClientOptions';
import { KassPaymentCheck } from './KassPaymentCheck';
import {
    isKassPaymentResponseFailed,
    KassPayment,
    KassPaymentResponse,
    KassPaymentResponseFailed,
    KassPaymentResponseSuccess,
} from './PaymentResponse';

/**
 * API to https://www.kass.is/ payment gateway.
 */
export class KassClient extends KassClientBase {
    /**
     * Waits for a transaction to be 'paid' or 'rejected'.
     * @param {string} param.id payment_id
     */
    async waitForTransaction({
        id,
        forcePolling,
        cb,
    }: {
        id: string;
        forcePolling?: boolean;
        cb: (status: KassPaymentStatus) => void;
    }): Promise<void> {
        const results = await fetch(`${this.url}/${id}/status`, {
            headers: this.header,
        });
        const { status } = (await results.json()) as KassPaymentCheck;
        if (status === KASS_STATUS.PENDING) {
            return void setTimeout(
                () => this.waitForTransaction({ id, cb, forcePolling }),
                this.timeBetweenPollingS * 1000,
            );
        }
        cb(status);
    }
    /**
     * Cancel a payment request.
     * @param {string} param.id payment_id
     */
    async cancel({ id }: { id: string }): Promise<boolean> {
        const results = await fetch(`${this.url}/${id}`, {
            headers: this.header,
            method: 'DELETE',
        });
        const json = (await results.json()) as KassPaymentCheck;
        return !!(json.status && json.status === KASS_STATUS.REJECTED);
    }

    /**
     * Creates a payment request.
     *
     * Sucessfull request returns an object with
     * cancel - cancels payment request
     * paymentState - promise that resolves to 'paid' or 'rejected'
     */
    async createPayment(
        properties: KassPayment,
    ): Promise<
        | KassPaymentResponseFailed
        | (KassPaymentResponseSuccess & {
              paymentState: Promise<KassPaymentStatus>;
              cancel: () => Promise<boolean>;
          })
    > {
        if (!Number.isInteger(properties.amount) || properties.amount <= 0) {
            throw new Error(INCORRECT_AMOUNT);
        }
        if (!properties.recipient || typeof properties.recipient !== 'string') {
            throw new Error(RECIPENT_SHOULD_BE_A_STRING);
        }
        const results = await fetch(this.url, {
            body: JSON.stringify(properties),
            headers: this.header,
            method: 'post',
        });
        const data = (await results.json()) as KassPaymentResponse;
        if (isKassPaymentResponseFailed(data)) {
            return data as KassPaymentResponseFailed;
        }
        const id = data.id;
        return {
            ...data,
            cancel: () => this.cancel({ id }),
            paymentState: new Promise((resolve) => {
                this.waitForTransaction({
                    id,
                    cb: (value) => {
                        resolve(value);
                    },
                });
            }),
        };
    }
}
