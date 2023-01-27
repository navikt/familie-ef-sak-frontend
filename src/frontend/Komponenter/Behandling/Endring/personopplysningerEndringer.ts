export interface IEndringerPersonopplysninger {
    sjekketTidspunkt: string;
    endringer: IEndringer;
}

export interface IEndringer {
    folkeregisterpersonstatus: IEndring;
    fødselsdato: IEndring;
    dødsdato: IEndring;

    barn: IEndringMedDetaljer<Personendring[]>;
    annenForelder: IEndringMedDetaljer<Personendring[]>;

    adresse: IEndring;

    statsborgerskap: IEndring;
    sivilstand: IEndring;
    fullmakt: IEndring;
    innflyttingTilNorge: IEndring;
    utflyttingFraNorge: IEndring;
    oppholdstillatelse: IEndring;
    vergemål: IEndring;
}

export interface IEndring {
    harEndringer: boolean;
}

export type IEndringMedDetaljer<T> = IEndring & {
    detaljer: T;
};

export interface Personendring {
    ident: string;
    endringer: {
        felt: string;
        tidligere: string;
        ny: string;
    }[];
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
    annenForelder: 'Annen forelder',
    innflyttingTilNorge: 'Innflytting til Norge',
    utflyttingFraNorge: 'Utflytting fra Norge',
    oppholdstillatelse: 'Oppholdstillatelse',
    vergemål: 'Vergemål',
};
