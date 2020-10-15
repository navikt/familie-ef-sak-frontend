import { IStatsborgerskap } from '../../../typer/personopplysninger';

export interface IInngangsvilkår {
    medlemskap: IMedlemskap;
    vurderinger: IVurdering[];
}

export interface IVurdering {
    id: string;
    resultat: Vilkårsresultat;
    behandlingId: string;
    vilkårType: VilkårType;
    begrunnelse?: string;
    unntak?: UnntakType;
    delvilkårsvurderinger: IDelvilkår[];
    endretAv: string;
    endretTid: string;
}

export interface IDelvilkår {
    type: DelvilkårType;
    resultat: Vilkårsresultat;
}

export interface IMedlemskap {
    søknadsgrunnlag: IMedlemskapSøknadsgrunnlag;
    registergrunnlag: IMedlemskapRegistergrunnlag;
}

export interface IMedlemskapSøknadsgrunnlag {
    bosattNorgeSisteÅrene: boolean;
    oppholderDuDegINorge: boolean;
    utenlandsopphold: IUtenlandsopphold[];
}

export interface IMedlemskapRegistergrunnlag {
    nåværendeStatsborgerskap: string[];
    oppholdstatus: IOppholdstatus[];
    statsborgerskap: IStatsborgerskap[];
}

export interface IUtenlandsopphold {
    fraDato: string;
    tilDato: string;
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

export enum Vilkårsresultat {
    JA = 'JA',
    NEI = 'NEI',
    IKKE_VURDERT = 'IKKE_VURDERT',
}

export const vilkårsresultatTypeTilTekst: Record<Vilkårsresultat, string> = {
    JA: 'Ja',
    NEI: 'Nei',
    IKKE_VURDERT: 'Ikke vurdert',
};

export type VilkårType = 'FORUTGÅENDE_MEDLEMSKAP' | 'LOVLIG_OPPHOLD';

export const vilkårTypeTilTekst: Record<VilkårType, string> = {
    FORUTGÅENDE_MEDLEMSKAP: 'Vilkår om forutgående medlemskap',
    LOVLIG_OPPHOLD: 'Vilkår om opphold i Norge',
};

export enum DelvilkårType {
    TRE_ÅRS_MEDLEMSKAP = 'TRE_ÅRS_MEDLEMSKAP',
    DOKUMENTERT_FLYKTNINGSTATUS = 'DOKUMENTERT_FLYKTNINGSTATUS',
    BOR_OG_OPPHOLDER_SEG_I_NORGE = 'BOR_OG_OPPHOLDER_SEG_I_NORGE',
}

export const delvilkårTypeTilTekst: Record<DelvilkårType, string> = {
    TRE_ÅRS_MEDLEMSKAP: 'Har bruker vært medlem i folketrygden i de siste 3 årene?',
    DOKUMENTERT_FLYKTNINGSTATUS: 'Er flyktningstatus dokumentert?',
    BOR_OG_OPPHOLDER_SEG_I_NORGE: 'Bor og oppholder bruker og barna seg i Norge?',
};

export enum UnntakType {
    HAR_IKKE_UNNTAK = 'HAR_IKKE_UNNTAK',
    ARBEID_NORSK_ARBEIDSGIVER = 'ARBEID_NORSK_ARBEIDSGIVER',
    UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER = 'UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER',
}

export const unntakTypeTilTekst: Record<UnntakType, string> = {
    HAR_IKKE_UNNTAK: 'Har ikke unntak',
    ARBEID_NORSK_ARBEIDSGIVER: 'Arbeid for norsk arbeidsgiver',
    UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER: 'Utenlandsopphold på mindre enn 6 uker',
};
