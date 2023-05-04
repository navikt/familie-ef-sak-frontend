import {
    Folkeregisterpersonstatus,
    IInnflyttingTilNorge,
    IStatsborgerskap,
    IUtflyttingFraNorge,
} from '../../../../App/typer/personopplysninger';

export interface IMedlemskap {
    søknadsgrunnlag: IMedlemskapSøknadsgrunnlag;
    registergrunnlag: IMedlemskapRegistergrunnlag;
}

export interface IMedlemskapSøknadsgrunnlag {
    bosattNorgeSisteÅrene: boolean;
    oppholderDuDegINorge: boolean;
    oppholdsland?: string;
    utenlandsopphold: IUtenlandsopphold[];
}

export interface IMedlemskapRegistergrunnlag {
    nåværendeStatsborgerskap: string[];
    oppholdstatus: IOppholdstatus[];
    statsborgerskap: IStatsborgerskap[];
    folkeregisterpersonstatus: Folkeregisterpersonstatus; //TODO: Definere typen et annet sted enn personopplysninger?
    innflytting: IInnflyttingTilNorge[];
    utflytting: IUtflyttingFraNorge[];
    medlUnntak: IGyldigeVedtakPerioderIMedl;
}

export type IGyldigeVedtakPerioderIMedl = { gyldigeVedtaksPerioder: IGyldigVedtakPeriode[] };

export interface IGyldigVedtakPeriode {
    fraogmedDato: string;
    tilogmedDato: string;
    erMedlemIFolketrygden: boolean;
}

export interface IUtenlandsopphold {
    fraDato: string;
    tilDato: string;
    land?: string;
    årsak: string;
}

export interface IOppholdstatus {
    fraDato?: string;
    tilDato?: string;
    oppholdstillatelse: Oppholdstatus;
}

export type Oppholdstatus = 'MIDLERTIDIG' | 'PERMANENT' | 'UKJENT';

export const oppholdsstatusTypeTilTekst: Record<Oppholdstatus, string> = {
    MIDLERTIDIG: 'Midlertidig',
    PERMANENT: 'Permanent',
    UKJENT: 'Ukjent',
};
