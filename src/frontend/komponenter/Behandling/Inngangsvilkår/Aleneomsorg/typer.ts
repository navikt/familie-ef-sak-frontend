export interface IBarnMedSamvær {
    barneId: string;
    søknadsgrunnlag: IBarnMedSamværSøknadsgrunnlag;
    registergrunnlag: IBarnMedSamværRegistergrunnlag;
}

export interface IBarnMedSamværSøknadsgrunnlag {
    navn?: string;
    fødselsnummer?: string;
    fødselTermindato?: string;
    erBarnetFødt: boolean;
    harSammeAdresse?: boolean;
    skalBoBorHosSøker?: ESkalBarnetBoHosSøker;
    forelder?: IAnnenForelder;
    ikkeOppgittAnnenForelderBegrunnelse?: string;
    spørsmålAvtaleOmDeltBosted?: boolean;
    skalAnnenForelderHaSamvær?: EHarSamværMedBarn;
    harDereSkriftligAvtaleOmSamvær?: EHarSkriftligSamværsavtale;
    hvordanPraktiseresSamværet?: string; // Tekst
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
}

export interface IBarnMedSamværRegistergrunnlag {
    navn?: string;
    fødselsnummer?: string;
    harSammeAdresse?: boolean;
    forelder?: IAnnenForelder;
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
    jaKonkreteTidspunkter: 'Ja, den beskriver  når barnet er sammen med hver av foreldrene',
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
    ja: 'Ja, og vi har eller skal registrere i Folkeregisteret',
    nei: 'Nei',
    jaMenSamarbeiderIkke: 'Ja, men den andre forelderen samarbeider ikke om adresseendring',
};
