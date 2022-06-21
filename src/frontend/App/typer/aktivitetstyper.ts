//interfaces

import { IDokumentasjon } from './felles';
import { ESagtOppEllerRedusert } from '../../Komponenter/Behandling/Inngangsvilkår/Samliv/typer';
import {
    EDinSituasjon,
    EStilling,
    EStudieandel,
    EUtdanningsform,
} from '../../Komponenter/Behandling/Aktivitet/Aktivitet/typer';

export interface IAktivitet {
    arbeidssituasjon: string[];
    arbeidsforhold: IArbeidsforhold[];
    selvstendig?: ISelvstendig[];
    aksjeselskap: IAksjeselskap[];
    arbeidssøker?: IArbeidssøker;
    underUtdanning?: IUnderUtdanning;
    virksomhet?: IVirksomhet;
    gjelderDeg: EDinSituasjon[];
    særligeTilsynsbehov: ISærligeTilsynsbehov[];
    tidligereUtdanninger: ITidligereUtdanning[];
    datoOppstartJobb?: string;
    erIArbeid?: string;
}

export interface ISagtOppEllerRedusertStilling {
    sagtOppEllerRedusertStilling?: ESagtOppEllerRedusert;
    årsak?: string;
    dato?: string;
    dokumentasjon?: IDokumentasjon;
}

export interface IArbeidsforhold {
    arbeidsgivernavn: string;
    arbeidsmengde: number;
    fastEllerMidlertidig?: EStilling;
    harSluttdato: boolean;
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
    linjeKursGrad: string;
    fra: string;
    til: string;
    offentligEllerPrivat: EUtdanningsform;
    heltidEllerDeltid: EStudieandel;
    hvorMyeSkalDuStudere?: number;
    hvaErMåletMedUtdanningen?: string;
    utdanningEtterGrunnskolen: boolean;
    semesteravgift?: number;
    studieavgift?: number;
    eksamensgebyr?: number;
}

export interface ITidligereUtdanning {
    linjeKursGrad: string;
    fra: string;
    til: string;
}

export interface ISærligeTilsynsbehov {
    id: string;
    navn?: string;
    erBarnetFødt: boolean;
    fødselTermindato?: string;
    særligeTilsynsbehov?: string;
}
