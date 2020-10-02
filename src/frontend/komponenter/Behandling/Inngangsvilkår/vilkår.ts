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
    unntak: string;
    endretAv: string;
    endretTid: Date;
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
    fraDato: Date;
    tilDato: Date;
    årsak: string;
}

export interface IOppholdstatus {
    fraDato?: Date;
    tilDato?: Date;
    oppholdstillatelse: Oppholdstatus;
}

export const enum Oppholdstatus {
    MIDLERTIDIG = 'MIDLERTIDIG',
    PERMANENT = 'PERMANENT',
    UKJENT = 'UKJENT',
}

export const enum VilkårResultat {
    JA = 'JA',
    NEI = 'NEI',
    IKKE_VURDERT = 'IKKE_VURDERT',
}

export const enum VilkårType {
    FORUTGÅENDE_MEDLEMSKAP = 'FORUTGÅENDE_MEDLEMSKAP',
    LOVLIG_OPPHOLD = 'LOVLIG_OPPHOLD',
}
