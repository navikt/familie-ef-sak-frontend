import { idnr } from '@navikt/fnrvalidator';

// NPID har måned +20 (21–32). Syntetiske NPID-er i dev har måned +60 (61–72).
export const erNPID = (ident: string): boolean => {
    if (!/^\d{11}$/.test(ident)) return false;
    const måned = parseInt(ident.substring(2, 4), 10);

    const erSyntetiskNPID = måned > 60 && måned <= 72;
    const erNPID = måned > 20 && måned <= 32;

    return erSyntetiskNPID || erNPID;
};

export const erGyldigPersonident = (ident: string): boolean =>
    idnr(ident).status === 'valid' || erNPID(ident);
