/* We want to force incorrect typing from time to time. */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { KassClient } from './KassClient';
import {
    INCORRECT_AMOUNT,
    RECIPENT_SHOULD_BE_A_STRING,
    TOKEN_CANNOT_BE_NULL,
} from './KassClientOptions';

const token = 'kass_test_auth_token';
const url = 'https://api.testing.kass.is/v1/payments';

describe('KassClient', () => {
    describe('constructor', () => {
        it('Token cannot be null', () => {
            expect(() => new KassClient({ token: '' })).toThrow(
                TOKEN_CANNOT_BE_NULL,
            );
        });
        it('Token props works', () => {
            const client = new KassClient({ token });
            expect(client.token).toBe(token);
        });
        it('timeBetweenPollingS props works', () => {
            const s = 99;
            const client = new KassClient({ token, timeBetweenPollingS: s });
            expect(client.timeBetweenPollingS).toBe(s);
        });
    });

    describe('createPayment', () => {
        it('Recipent cannot be null', () => {
            const client = new KassClient({ token });
            expect(() =>
                client.createPayment({ amount: 1, recipient: null as any }),
            ).rejects.toThrow(RECIPENT_SHOULD_BE_A_STRING);
        });
        it('Recipent should be a string', () => {
            const client = new KassClient({ token });
            expect(() =>
                client.createPayment({ amount: 1, recipient: 9999 as any }),
            ).rejects.toThrow(RECIPENT_SHOULD_BE_A_STRING);
        });
        it('Amount cannot be negative', () => {
            const client = new KassClient({ token });
            expect(() =>
                client.createPayment({ amount: -12, recipient: '12' }),
            ).rejects.toThrow(INCORRECT_AMOUNT);
        });
        it('Amount needs to be a whole number', () => {
            const client = new KassClient({ token });
            expect(() =>
                client.createPayment({ amount: 14.5, recipient: '12' }),
            ).rejects.toThrow(INCORRECT_AMOUNT);
        });
        it('Amount needs to be a number', () => {
            const client = new KassClient({ token });
            expect(() =>
                client.createPayment({ amount: '14' as any, recipient: '12' }),
            ).rejects.toThrow(INCORRECT_AMOUNT);
        });
        describe('with polling', () => {
            it(
                '100 1000 timeout',
                async () => {
                    const client = new KassClient({
                        token,
                        url,
                    });
                    const payment = await client.createPayment({
                        amount: 100,
                        recipient: '1001000',
                        expires_in: 10,
                    });
                    if (!payment.success) {
                        throw new Error('failed.');
                    }
                    const pay = await payment.paymentState;
                    expect(pay).toBe('rejected');
                },
                20 * 1000,
            );
            it('100 1001 returns payed', async () => {
                const client = new KassClient({ token, url });
                const payment = await client.createPayment({
                    amount: 100,
                    recipient: '1001001',
                });
                if (!payment.success) {
                    throw new Error('failed.');
                }
                const pay = await payment.paymentState;
                expect(pay).toBe('paid');
            });
            it('100 1002 returns rejected', async () => {
                const client = new KassClient({ token, url });
                const payment = await client.createPayment({
                    amount: 100,
                    recipient: '1001002',
                });
                if (!payment.success) {
                    throw new Error('failed.');
                }
                const pay = await payment.paymentState;
                expect(pay).toBe('rejected');
            });
            it('100 1000 cancel', async () => {
                const client = new KassClient({ token, url });
                const payment = await client.createPayment({
                    amount: 100,
                    recipient: '1001000',
                });
                if (!payment.success) {
                    throw new Error('failed.');
                }
                payment.cancel();
                const pay = await payment.paymentState;
                expect(pay).toBe('rejected');
            }, 10000);
        });
    });
});
