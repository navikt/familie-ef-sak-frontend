export interface IEndringerPersonopplysninger {
    sjekketTidspunkt: string;
    endringer: IEndringer;
}

export interface IEndringer {
    folkeregisterpersonstatus: IEndring;
    fødselsdato: IEndring;
    dødsdato: IEndring;
    statsborgerskap: IEndring;
    sivilstand: IEndring;
    adresse: IEndring;
    fullmakt: IEndring;
    barn: IEndringMedDetaljer<BarnEndringer[]>;
    innflyttingTilNorge: IEndring;
    utflyttingFraNorge: IEndring;
    oppholdstillatelse: IEndring;
    vergemål: IEndring;
}

export const endringerKeyTilTekst: Record<keyof IEndringer, string> = {
    folkeregisterpersonstatus: 'Personstatus',
    fødselsdato: 'Fødselsdato',
    dødsdato: 'Dato for dødsfall',
    statsborgerskap: 'Statsborgerskap',
    sivilstand: 'Sivilstand',
    adresse: 'Adresse',
    fullmakt: 'Fullmakt',
    barn: 'Barn',
    innflyttingTilNorge: 'Innflytting til Norge',
    utflyttingFraNorge: 'Utflytting fra Norge',
    oppholdstillatelse: 'Oppholdstillatelse',
    vergemål: 'Vergemål',
};

export interface IEndring {
    harEndringer: boolean;
}

export type IEndringMedDetaljer<T> = IEndring & {
    detaljer: T;
};

export interface BarnEndringer {
    ident: string;
    endringer: {
        felt: string;
        tidligere: string;
        ny: string;
    }[];
}
