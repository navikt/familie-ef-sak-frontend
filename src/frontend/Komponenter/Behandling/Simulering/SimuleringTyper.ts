export interface SimuleringResultat {
    perioder: SimuleringPeriode[];
    fomDatoNestePeriode: string;
    etterbetaling: number;
    feilutbetaling: number;
    fom: string;
    tomDatoNestePeriode: string;
    forfallsdatoNestePeriode: string;
    tidSimuleringHentet: string;
    tomSisteUtbetaling: string;
    sumManuellePosteringer?: number;
}

export interface SimuleringPeriode {
    fom: string;
    tom: string;
    forfalldato: string;
    nyttBeløp: number;
    tidligereUtbetalt: number;
    resultat: number;
    feilutbetaling: number;
}

export interface SimuleringTabellRad {
    måned: string;
    nyttBeløp: number;
    tidligereUtbetalt: number;
    resultat: number;
    gjelderNestePeriode: boolean;
}
export interface SimuleringÅrsvelger {
    valgtÅr: number;
    settÅr: (år: number) => void;
    muligeÅr: number[];
}
