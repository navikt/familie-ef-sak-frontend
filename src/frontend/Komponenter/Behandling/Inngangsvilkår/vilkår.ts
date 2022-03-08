import { IMedlemskap } from './Medlemskap/typer';
import { ISivilstandInngangsvilkår } from './Sivilstand/typer';
import { IBosituasjon, ISivilstandsplaner } from './Samliv/typer';
import { IBarnMedSamvær } from './Aleneomsorg/typer';
import {
    IAktivitet,
    IAktivitetArbeid,
    ISagtOppEllerRedusertStilling,
} from '../../../App/typer/overgangsstønad';
import { Begrunnelse, SvarId } from '../Vurdering/typer';
import { ITidligereVedtaksperioder } from '../TidligereVedtaksperioder/typer';

export interface IVilkår {
    vurderinger: IVurdering[];
    grunnlag: IVilkårGrunnlag;
}

export interface IVilkårGrunnlag {
    tidligereVedtaksperioder: ITidligereVedtaksperioder;
    medlemskap: IMedlemskap;
    sivilstand: ISivilstandInngangsvilkår;
    bosituasjon?: IBosituasjon;
    sivilstandsplaner?: ISivilstandsplaner;
    barnMedSamvær: IBarnMedSamvær[];
    sagtOppEllerRedusertStilling?: ISagtOppEllerRedusertStilling;
    aktivitet?: IAktivitet;
    registeropplysningerOpprettetTid: string;
    aktivitetArbeid?: IAktivitetArbeid;
}

export interface IVurdering {
    id: string;
    behandlingId: string;
    resultat: Vilkårsresultat;
    vilkårType: VilkårType;
    barnId?: string;
    endretAv: string;
    endretTid: string;
    delvilkårsvurderinger: IDelvilkår[];
}

export type SvarPåVilkårsvurdering = Pick<
    IVurdering,
    'id' | 'delvilkårsvurderinger' | 'behandlingId'
>;

export type OppdaterVilkårsvurdering = Pick<IVurdering, 'id' | 'behandlingId'>;

export interface Vurderingsfeilmelding {
    [Key: string]: string;
}

export interface IDelvilkår {
    resultat: Vilkårsresultat;
    vurderinger: Vurdering[];
}

export interface Vurdering {
    regelId: string;
    svar?: SvarId;
    begrunnelse?: Begrunnelse;
}

export enum Vilkårsresultat {
    OPPFYLT = 'OPPFYLT',
    IKKE_OPPFYLT = 'IKKE_OPPFYLT',
    IKKE_AKTUELL = 'IKKE_AKTUELL',
    IKKE_TATT_STILLING_TIL = 'IKKE_TATT_STILLING_TIL',
    SKAL_IKKE_VURDERES = 'SKAL_IKKE_VURDERES',
}

/**
 * Gjør det mulig å splitte opp vurderinger i eks Medlemskap, Aleneomsorg, etc.
 * Når man eks legger til en vurdering til medlemskap i VurderingConfig nå så kommer den opp automatisk
 */
export type VilkårType = InngangsvilkårType | AktivitetsvilkårType | TidligereVedtaksperioderType;

export enum InngangsvilkårType {
    FORUTGÅENDE_MEDLEMSKAP = 'FORUTGÅENDE_MEDLEMSKAP',
    LOVLIG_OPPHOLD = 'LOVLIG_OPPHOLD',
    MOR_ELLER_FAR = 'MOR_ELLER_FAR',
    SIVILSTAND = 'SIVILSTAND',
    SAMLIV = 'SAMLIV',
    ALENEOMSORG = 'ALENEOMSORG',
    NYTT_BARN_SAMME_PARTNER = 'NYTT_BARN_SAMME_PARTNER',
}

export enum AktivitetsvilkårType {
    AKTIVITET = 'AKTIVITET',
    SAGT_OPP_ELLER_REDUSERT = 'SAGT_OPP_ELLER_REDUSERT',
    ALDER_PÅ_BARN = 'ALDER_PÅ_BARN',
    INNTEKT = 'INNTEKT',
    AKTIVITET_ARBEID = 'AKTIVITET_ARBEID',
}

export enum TidligereVedtaksperioderType {
    TIDLIGERE_VEDTAKSPERIODER = 'TIDLIGERE_VEDTAKSPERIODER',
}

export enum BarnetilsynsvilkårType {
    AKTIVITET = 'AKTIVITET',
    INNTEKT = 'INNTEKT',
    ALDER_PÅ_BARN = 'ALDER_PÅ_BARN',
}
