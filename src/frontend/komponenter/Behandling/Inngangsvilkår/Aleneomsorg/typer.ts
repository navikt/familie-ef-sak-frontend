export interface IAleneomsorgInngangsvilkår {
    barneId: string;
    søknadsgrunnlag: IAleneomsorgSøknadsgrunnlag;
    registergrunnlag: IAleneomsorgRegistergrunnlag;
}

export interface IAleneomsorgSøknadsgrunnlag {
    navn?: string;
    fødselsnummer?: string;
    fødselTermindato?: string;
    skalBoBorHosSøker?: boolean;
    forelder?: IAnnenForelderAleneomsorg;
    ikkeOppgittAnnenForelderBegrunnelse?: string;
    spørsmålAvtaleOmDeltBosted?: boolean;
    skalAnnenForelderHaSamvær?: string; // TODO: enum?
    harDereSkriftligAvtaleOmSamvær?: string; // TODO: enum
    hvordanPraktiseresSamværet?: string; // TODO: enum
    borAnnenForelderISammeHus?: string; // TODO: enum
    borAnnenForelderISammeHusBeskrivelse?: string;
    harDereTidligereBoddSammen?: boolean;
    nårFlyttetDereFraHverandre?: string;
    hvorMyeErDuSammenMedAnnenForelder?: string; // TODO: enum
    beskrivSamværUtenBarn?: string;
}
export interface IAnnenForelderAleneomsorg {
    navn?: string;
    fødselsnummer?: string;
    fødselsdato?: string;
    bosattINorge?: boolean;
    land?: string;
}

export interface IAleneomsorgRegistergrunnlag {
    navn?: string;
    fødselsnummer?: string;
    skalBoBorHosSøker?: boolean;
    forelder?: IAnnenForelderAleneomsorg;
}

// export enum EÅrsakEnslig {
//     samlivsbruddForeldre = 'samlivsbruddForeldre',
//     samlivsbruddAndre = 'samlivsbruddAndre',
//     aleneFraFødsel = 'aleneFraFødsel',
//     endringISamværsordning = 'endringISamværsordning',
//     dødsfall = 'dødsfall',
// }
