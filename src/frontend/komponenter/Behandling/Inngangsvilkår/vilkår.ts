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
    begrunnelse: string;
    unntak: UnntakType;
    endretAv: string;
    endretTid: string;
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

export enum UnntakType {
    ARBEID_NORSK_ARBEIDSGIVER = 'ARBEID_NORSK_ARBEIDSGIVER',
    UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER = 'UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER',
}

export const unntakTypeTilTekst: Record<UnntakType, string> = {
    ARBEID_NORSK_ARBEIDSGIVER: 'Arbeid for norsk arbeidsgiver',
    UTENLANDSOPPHOLD_MINDRE_ENN_6_UKER: 'Utenlandsopphold på mindre enn 6 uker',
};
