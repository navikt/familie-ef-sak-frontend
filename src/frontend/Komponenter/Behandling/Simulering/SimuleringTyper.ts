export interface SimuleringResultat {
    perioder: SimuleringPeriode[];
    fomDatoNestePeriode: string;
    etterbetaling: number;
    feilutbetaling: number;
    feilutbetalingsår?: number;
    fireRettsgebyr?: number;
    visUnder4rettsgebyr: boolean;
    fom: string;
    tomDatoNestePeriode: string;
    forfallsdatoNestePeriode: string;
    tidSimuleringHentet: string;
    tomSisteUtbetaling: string;
    sumManuellePosteringer?: number;
    sumKreditorPosteringer?: number;
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
