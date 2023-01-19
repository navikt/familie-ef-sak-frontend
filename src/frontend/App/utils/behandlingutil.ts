import { compareDesc } from 'date-fns';

/**
 * Sorterer behandlinger etter vedtaksdato
 * Hvis vedtaksdato ikke finnes på noen av behandlingene, sorteres de etter opprettet
 * Hvis vedtaksdato ikke finnes på en av behandlingene sorteres null/undefined først
 */
export const sorterBehandlinger = <T extends { vedtaksdato?: string; opprettet: string }>(
    a: T,
    b: T
): number => {
    if (a.vedtaksdato && b.vedtaksdato) {
        return compareDesc(new Date(a.vedtaksdato), new Date(b.vedtaksdato));
    }
    if (!a.vedtaksdato && !b.vedtaksdato) {
        return compareDesc(new Date(a.opprettet), new Date(b.opprettet));
    }
    return a.vedtaksdato ? 1 : -1;
};
