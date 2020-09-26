export const isSSR = (): boolean =>
    typeof document === 'undefined' && typeof navigator === 'undefined';
