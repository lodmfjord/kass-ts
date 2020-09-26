import {
    KASS_STATUS_PAID,
    KASS_STATUS_PENDING,
    KASS_STATUS_REJECTED,
} from './KassClientOptions';

export interface KassPaymentCheck {
    status: KASS_STATUS_PENDING | KASS_STATUS_PAID | KASS_STATUS_REJECTED;
}
