//interfaces

import { IDokumentasjon } from './felles';

export interface IOvergangsstønad {
    sakId: string;
    aktivitet: IAktivitet;
    sagtOppEllerRedusertStilling?: ISagtOppEllerRedusertStilling;
}

export interface IAktivitet {
    arbeidssituasjon: string[];
    arbeidsforhold: IArbeidsforhold[];
    selvstendig?: ISelvstendig;
    aksjeselskap: IAksjeselskap[];
    arbeidssøker?: IArbeidssøker;
    underUtdanning?: IUnderUtdanning;
    aktivitetsplikt?: string;
    situasjon: ISituasjon;
    virksomhet?: IVirksomhet;
}

export interface ISagtOppEllerRedusertStilling {
    sagtOppEllerRedusertStilling: string;
    årsak?: string;
    dato?: string;
    dokumentasjon?: IDokumentasjon;
}

export interface IArbeidsforhold {
    arbeidsgivernavn: string;
    arbeidsmengde: number;
    fastEllerMidlertidig: string;
    sluttdato?: string;
}

export interface ISelvstendig {
    firmanavn: string;
    organisasjonsnummer: string;
    etableringsdato: string;
    arbeidsmengde: number;
    hvordanSerArbeidsukenUt: string;
}

export interface IAksjeselskap {
    navn: string;
    arbeidsmengde: number;
}

export interface IVirksomhet {
    virksomhetsbeskrivelse: string;
}

export interface IArbeidssøker {
    registrertSomArbeidssøkerNav: boolean;
    villigTilÅTaImotTilbudOmArbeid: boolean;
    kanDuBegynneInnenEnUke: boolean;
    kanDuSkaffeBarnepassInnenEnUke?: boolean;
    hvorØnskerDuArbeid: string;
    ønskerDuMinst50ProsentStilling: boolean;
}

export interface IUnderUtdanning {
    skoleUtdanningssted: string;
    utdanning: IUtdanning;
    offentligEllerPrivat: string;
    heltidEllerDeltid: string;
    hvorMyeSkalDuStudere?: number;
    hvaErMåletMedUtdanningen?: string;
    utdanningEtterGrunnskolen: boolean;
    tidligereUtdanninger: IUtdanning[];
}

export interface IUtdanning {
    linjeKursGrad: string;
    nårVarSkalDuVæreElevStudent: IPeriode;
}

//cKommer troligvis endres
export interface IPeriode {
    fraMåned: number;
    fraÅr: number;
    tilMåned: number;
    tilÅr: number;
}

export interface ISituasjon {
    sykdom?: IDokumentasjon;
    barnsSykdom?: IDokumentasjon;
    manglendeBarnepass?: IDokumentasjon;
    barnMedSærligeBehov?: IDokumentasjon;
}
