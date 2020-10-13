import { IStatsborgerskap } from '../../../typer/personopplysninger';

export interface IInngangsvilkår {
    medlemskap: IMedlemskap;
    vurderinger: IVurdering[];
}

export interface IVurdering {
    id: string;
    resultat: VilkårResultat;
    behandlingId: string;
    vilkårType: VilkårType;
    begrunnelse?: string;
    unntak?: UnntakType;
    delvilkårVurderinger: IDelvilkår[];
    endretAv: string;
    endretTid: string;
}

export interface IDelvilkår {
    type: DelvilkårType;
    resultat: VilkårResultat;
}

export interface IMedlemskap {
    søknadGrunnlag: IMedlemskapSøknadGrunnlag;
    registerGrunnlag: IMedlemskapRegisterGrunnlag;
}

export interface IMedlemskapSøknadGrunnlag {
    bosattNorgeSisteÅrene: boolean;
    oppholderDuDegINorge: boolean;
    utenlandsopphold: IUtenlandsopphold[];
}

export interface IMedlemskapRegisterGrunnlag {
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

export enum VilkårResultat {
    JA = 'JA',
    NEI = 'NEI',
    IKKE_VURDERT = 'IKKE_VURDERT',
}

export const vilkårsResultatTypeTilTekst: Record<VilkårResultat, string> = {
    JA: 'Ja',
    NEI: 'Nei',
    IKKE_VURDERT: 'Ikke vurdert',
};

export type VilkårType = 'FORUTGÅENDE_MEDLEMSKAP' | 'LOVLIG_OPPHOLD';

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
    UNDEFINED = 'UNDEFINED',
    ARBEID_NORSK_ARBEIDSGIVER = 'ARBEID_NORSK_ARBEIDSGIVER',
    UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER = 'UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER',
}

export const unntakTypeTilTekst: Record<UnntakType, string> = {
    UNDEFINED: 'Skal ikke vises',
    ARBEID_NORSK_ARBEIDSGIVER: 'Arbeid for norsk arbeidsgiver',
    UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER: 'Utenlandsopphold på mindre enn 6 uker',
};
