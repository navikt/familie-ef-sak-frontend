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
