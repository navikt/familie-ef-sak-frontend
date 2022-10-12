import { EÅrsakBarnepass } from '../../Aktivitet/AlderPåBarn/AlderPåBarnTyper';
import { ITidligereVedtaksperioder } from '../../TidligereVedtaksperioder/typer';

export interface IBarnMedSamvær {
    barnId: string;
    søknadsgrunnlag: IBarnMedSamværSøknadsgrunnlag;
    registergrunnlag: IBarnMedSamværRegistergrunnlag;
    barnepass?: IBarnepass;
}

export interface IBarnepass {
    skalHaBarnepass?: boolean;
    barnepassordninger: BarnepassordningDto[];
    årsakBarnepass?: EÅrsakBarnepass;
}

export interface BarnepassordningDto {
    type: ETypeBarnepassOrdning;
    navn: string;
    fra: string;
    til: string;
    beløp: number;
}

export interface IBarnMedLøpendeStønad {
    barn: string[];
    dato: string;
}

export enum ETypeBarnepassOrdning {
    barnehageOgLiknende = 'barnehageOgLiknende',
    privat = 'privat',
}

export const typeBarnepassordningTilTekst: Record<ETypeBarnepassOrdning, string> = {
    barnehageOgLiknende: 'Barnehage, SFO eller liknende',
    privat: 'Dagmamma eller annen privat ordning',
};

export interface IBarnMedSamværSøknadsgrunnlag {
    navn?: string;
    fødselTermindato?: string;
    harSammeAdresse?: boolean;
    skalBoBorHosSøker?: ESkalBarnetBoHosSøker;
    forelder?: IAnnenForelder;
    ikkeOppgittAnnenForelderBegrunnelse?: string;
    spørsmålAvtaleOmDeltBosted?: boolean;
    skalAnnenForelderHaSamvær?: EHarSamværMedBarn;
    harDereSkriftligAvtaleOmSamvær?: EHarSkriftligSamværsavtale;
    hvordanPraktiseresSamværet?: string;
    borAnnenForelderISammeHus?: EBorAnnenForelderISammeHus;
    borAnnenForelderISammeHusBeskrivelse?: string;
    harDereTidligereBoddSammen?: boolean;
    nårFlyttetDereFraHverandre?: string;
    hvorMyeErDuSammenMedAnnenForelder?: EHvorMyeSammen;
    beskrivSamværUtenBarn?: string;
}

export interface IAnnenForelder {
    navn?: string;
    fødselsnummer?: string;
    fødselsdato?: string;
    bosattINorge?: boolean;
    land?: string;
    dødsfall?: string;
    tidligereVedtaksperioder?: ITidligereVedtaksperioder;
    avstandTilSøker: IAvstandTilSøker;
}

export interface IAvstandTilSøker {
    avstandIKm?: number;
    langAvstandTilSøker: EAvstandTilSøker;
}

export enum EAvstandTilSøker {
    JA = 'JA',
    JA_UPRESIS = 'JA_UPRESIS',
    UKJENT = 'UKJENT',
}

export const avstandTilSøker: Record<EAvstandTilSøker, string> = {
    JA: 'km',
    JA_UPRESIS: 'Mer enn 1 km',
    UKJENT: 'Kan ikke automatisk beregnes',
};

export interface IBarnMedSamværRegistergrunnlag {
    navn?: string;
    fødselsnummer?: string;
    harSammeAdresse?: boolean;
    forelder?: IAnnenForelder;
    dødsdato?: string;
    fødselsdato?: string;
}

export enum EHarSamværMedBarn {
    jaIkkeMerEnnVanlig = 'jaIkkeMerEnnVanlig',
    jaMerEnnVanlig = 'jaMerEnnVanlig',
    nei = 'nei',
}

export const harSamværMedBarnTilTekst: Record<EHarSamværMedBarn, string> = {
    jaIkkeMerEnnVanlig:
        'Ja, men ikke mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende',
    jaMerEnnVanlig:
        'Ja, mer enn én ettermiddag i uken med overnatting og annenhver helg eller tilsvarende',
    nei: 'Nei, den andre forelderen har ikke samvær med barnet',
};

export enum EHarSkriftligSamværsavtale {
    jaKonkreteTidspunkter = 'jaKonkreteTidspunkter',
    jaIkkeKonkreteTidspunkter = 'jaIkkeKonkreteTidspunkter',
    nei = 'nei',
}

export const harSkriftligSamværsavtaleTilTekst: Record<EHarSkriftligSamværsavtale, string> = {
    jaKonkreteTidspunkter: 'Ja, og den beskriver når barnet er sammen med hver av foreldrene',
    jaIkkeKonkreteTidspunkter:
        'Ja, men den beskriver ikke når barnet er sammen med hver av foreldrene',
    nei: 'Nei',
};

export enum EBorAnnenForelderISammeHus {
    ja = 'ja',
    nei = 'nei',
    vetikke = 'vetikke',
}

export const borAnnenForelderISammeHusTilTekst: Record<EBorAnnenForelderISammeHus, string> = {
    ja: 'Ja',
    nei: 'Nei',
    vetikke: 'Vet ikke hvor den andre forelderen bor',
};

export enum EHvorMyeSammen {
    møtesIkke = 'møtesIkke',
    kunNårLeveres = 'kunNårLeveres',
    møtesUtenom = 'møtesUtenom',
}

export const hvorMyeSammenTilTekst: Record<EHvorMyeSammen, string> = {
    møtesIkke: 'Møtes ikke',
    kunNårLeveres: 'Møtes kun når barnet skal hentes eller leveres',
    møtesUtenom: 'Møtes også utenom henting og levering',
};

export enum ESkalBarnetBoHosSøker {
    ja = 'ja',
    jaMenSamarbeiderIkke = 'jaMenSamarbeiderIkke',
    nei = 'nei',
}

export const skalBarnetBoHosSøkerTilTekst: Record<ESkalBarnetBoHosSøker, string> = {
    ja: 'Ja, og vi har eller skal registrere adressen i Folkeregisteret',
    nei: 'Nei',
    jaMenSamarbeiderIkke: 'Ja, men den andre forelderen samarbeider ikke om adresseendring',
};

export enum EDelvilkårÅrsak {
    /** Nære boforhold **/
    SAMME_HUS_OG_FÆRRE_ENN_4_BOENHETER = 'SAMME_HUS_OG_FÆRRE_ENN_4_BOENHETER',
    SAMME_HUS_OG_FLERE_ENN_4_BOENHETER_MEN_VURDERT_NÆRT = 'SAMME_HUS_OG_FLERE_ENN_4_BOENHETER_MEN_VURDERT_NÆRT',
    SELVSTENDIGE_BOLIGER_SAMME_TOMT = 'SELVSTENDIGE_BOLIGER_SAMME_TOMT',
    SELVSTENDIGE_BOLIGER_SAMME_GÅRDSTUN = 'SELVSTENDIGE_BOLIGER_SAMME_GÅRDSTUN',
    NÆRMESTE_BOLIG_ELLER_REKKEHUS_I_SAMMEGATE = 'NÆRMESTE_BOLIG_ELLER_REKKEHUS_I_SAMMEGATE',
    TILSTØTENDE_BOLIGER_ELLER_REKKEHUS_I_SAMMEGATE = 'TILSTØTENDE_BOLIGER_ELLER_REKKEHUS_I_SAMMEGATE',
}

export const delvilkårÅrsakTilTekst: Record<EDelvilkårÅrsak, string> = {
    SAMME_HUS_OG_FÆRRE_ENN_4_BOENHETER:
        'Søker bor i samme hus som den andre forelderen og huset har 4 eller færre boenheter',
    SAMME_HUS_OG_FLERE_ENN_4_BOENHETER_MEN_VURDERT_NÆRT:
        'Søker bor i samme hus som den andre forelderen og huset har flere enn 4 boenheter, men boforholdet er vurdert nært',
    SELVSTENDIGE_BOLIGER_SAMME_TOMT:
        'Foreldrene bor i selvstendige boliger på samme tomt eller gårdsbruk',
    SELVSTENDIGE_BOLIGER_SAMME_GÅRDSTUN: 'Foreldrene bor i selvstendige boliger på samme gårdstun',
    NÆRMESTE_BOLIG_ELLER_REKKEHUS_I_SAMMEGATE:
        'Foreldrene bor i nærmeste bolig eller rekkehus i samme gate',
    TILSTØTENDE_BOLIGER_ELLER_REKKEHUS_I_SAMMEGATE:
        'Foreldrene bor i tilstøtende boliger eller rekkehus i samme gate',
};
