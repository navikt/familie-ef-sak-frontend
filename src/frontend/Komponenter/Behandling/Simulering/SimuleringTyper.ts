export interface ISimulering {
    perioder: ISimuleringPeriode[];
    fomDatoNestePeriode: string;
    etterbetaling: number;
    feilutbetaling: number;
    fom: string;
    tomDatoNestePeriode: string;
    forfallsdatoNestePeriode: string;
    tidSimuleringHentet: string;
    tomSisteUtbetaling: string;
}

export interface ISimuleringPeriode {
    fom: string;
    tom: string;
    forfalldato: string;
    nyttBeløp: number;
    tidligereUtbetalt: number;
    resultat: number;
    feilutbetaling: number;
}

export interface ISimuleringTabellRad {
    måned: string;
    nyttBeløp: number;
    tidligereUtbetalt: number;
    resultat: number;
    gjelderNestePeriode: boolean;
}
export interface ISimuleringÅrsvelger {
    valgtÅr: number;
    settÅr: (år: number) => void;
    muligeÅr: number[];
}

export interface ISimuleringTabell {
    perioder: ISimuleringTabellRad[];
    årsvelger: ISimuleringÅrsvelger;
}
