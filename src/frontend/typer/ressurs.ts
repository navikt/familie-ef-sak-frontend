export enum RessursStatus {
    FEILET = 'FEILET',
    HENTER = 'HENTER',
    IKKE_HENTET = 'IKKE_HENTET',
    IKKE_TILGANG = 'IKKE_TILGANG',
    SUKSESS = 'SUKSESS',
    FUNKSJONELL_FEIL = 'FUNKSJONELL_FEIL',
}

export type RessursSuksess<T> = {
    data: T;
    status: RessursStatus.SUKSESS;
};
export type RessursLaster = {
    status: RessursStatus.HENTER;
};

export type FeilMelding = {
    errorMelding?: string;
    melding: string;
    frontendFeilmelding: string;
};

export type RessursFeilet =
    | (FeilMelding & { status: RessursStatus.IKKE_TILGANG })
    | (FeilMelding & { status: RessursStatus.FEILET })
    | (FeilMelding & { status: RessursStatus.FUNKSJONELL_FEIL });

export type Ressurs<T> =
    | { status: RessursStatus.IKKE_HENTET }
    | RessursLaster
    | RessursSuksess<T>
    | RessursFeilet;

export const byggTomRessurs = <T>(): Ressurs<T> => {
    return {
        status: RessursStatus.IKKE_HENTET,
    };
};

export const byggHenterRessurs = <T>(): Ressurs<T> => {
    return {
        status: RessursStatus.HENTER,
    };
};

export const byggFeiletRessurs = <T>(melding: string, error?: Error): Ressurs<T> => {
    return {
        errorMelding: error ? error.message : undefined,
        melding,
        frontendFeilmelding: melding,
        status: RessursStatus.FEILET,
    };
};

export const byggSuksessRessurs = <T>(data: T): Ressurs<T> => {
    return {
        data,
        status: RessursStatus.SUKSESS,
    };
};

export const erAvTypeFeil = <T>(data: Ressurs<T>): boolean =>
    [RessursStatus.FEILET, RessursStatus.FUNKSJONELL_FEIL, RessursStatus.IKKE_TILGANG].includes(
        data.status
    );
