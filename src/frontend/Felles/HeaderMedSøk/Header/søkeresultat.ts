export enum Adressebeskyttelsegradering {
    STRENGT_FORTROLIG = 'STRENGT_FORTROLIG',
    STRENGT_FORTROLIG_UTLAND = 'STRENGT_FORTROLIG_UTLAND',
    FORTROLIG = 'FORTROLIG',
    UGRADERT = 'UGRADERT',
}

export const adressebeskyttelsestyper: Record<Adressebeskyttelsegradering, string> = {
    STRENGT_FORTROLIG: 'strengt fortrolig',
    STRENGT_FORTROLIG_UTLAND: 'strengt fortrolig utland',
    FORTROLIG: 'fortrolig',
    UGRADERT: 'ugradert',
};

export interface ISøkeresultat {
    adressebeskyttelseGradering?: Adressebeskyttelsegradering;
    fagsakId?: number | string; // null betyr at det ikke finnes fagsak på personen
    harTilgang: boolean;
    ident: string;
    ikon: React.ReactNode;
    rolle?: string;
    navn?: string;
}
