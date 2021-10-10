# Kass TS (DEPRECATED) (NOT BEING UPDATED)

Javascript module for [KASS](https://www.kass.is/) payment gateway. Based on Python module [KASS Flow](https://github.com/busla/kass-flow).

See the [KASS API docs](https://kass.github.io/api/) for more info.

This module is not affiliated with KASS.

## Installation
```sh
$ yarn install kass-ts
```

or 

```sh
$ npm install kass-ts
```

## Example

```js
import { KassClient } from 'kass-ts';

const client = new KassClient({token: 'kass_test_auth_token'});

const test = async () => {
    const payment = await client.createPayment({
                        amount: 100,
                        recipient: '1001001',
                    });
    if (payment.success) {
        // TODO: Save our ID?
        const { id } = payment;
        const paymentState = await payment.paymentState;
        if (paymentState === 'payed') {
            console.log('We got payed')
            return;
        }
        console.log('Something went wrong');
    }
}
const test2 = async () => {
    const payment = await client.createPayment({
                        amount: 100,
                        recipient: '1001000',
                    });
    if (payment.success) {
        // NO! We do not need this.
        payment.cancel();
    }
}
```
