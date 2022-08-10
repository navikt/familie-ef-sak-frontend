import {
    AktivitetsvilkårType,
    BarnetilsynsvilkårType,
    InngangsvilkårType,
    IVilkår,
    IVurdering,
    TidligereVedtaksperioderType,
    Vilkårsresultat,
    VilkårType,
} from '../../Inngangsvilkår/vilkår';
import { vilkårStatusForBarn } from '../../Vurdering/VurderingUtil';
import {
    IBeregningsperiodeBarnetilsyn,
    IVedtakForOvergangsstønad,
} from '../../../../App/typer/vedtak';
import { Ressurs, RessursStatus } from '../../../../App/typer/ressurs';

export const mapVilkårtypeTilResultat = (
    vurderinger: IVurdering[]
): Record<VilkårType, [Vilkårsresultat]> => {
    return vurderinger.reduce((acc, vurdering) => {
        const listeMedVilkårsresultat = acc[vurdering.vilkårType] ?? [];
        listeMedVilkårsresultat.push(vurdering.resultat);
        acc[vurdering.vilkårType] = listeMedVilkårsresultat;
        return acc;
    }, {} as Record<VilkårType, [Vilkårsresultat]>);
};

export const summerVilkårsresultat = (
    vilkårstypeTilResultat: Record<VilkårType, [Vilkårsresultat]>
): Record<Vilkårsresultat, number> => {
    return Object.entries(vilkårstypeTilResultat).reduce((acc, [type, resultatListe]) => {
        let resultat;
        if (
            type === InngangsvilkårType.ALENEOMSORG ||
            type === AktivitetsvilkårType.ALDER_PÅ_BARN
        ) {
            resultat = vilkårStatusForBarn(resultatListe);
        } else {
            // alle andre vilkår har kun ett resultat
            resultat = resultatListe[0];
        }
        acc[resultat] = (acc[resultat] ?? 0) + 1;
        return acc;
    }, {} as Record<Vilkårsresultat, number>);
};

export const eksistererVilkårsResultat = (
    vilkårstypeTilResultat: Record<VilkårType, [Vilkårsresultat]>,
    resultat: Vilkårsresultat
): boolean => {
    // @ts-ignore
    return [].concat(...Object.values(vilkårstypeTilResultat)).includes(resultat);
};

export const mapFraVilkårTilVurderinger = (vilkår: IVilkår): IVurdering[] => {
    return vilkår.vurderinger.filter(
        (v) =>
            v.vilkårType in InngangsvilkårType ||
            v.vilkårType in AktivitetsvilkårType ||
            v.vilkårType in TidligereVedtaksperioderType
    );
};

export const sorterUtInngangsvilkår = (vilkår: IVilkår): IVurdering[] => {
    return vilkår.vurderinger.filter((v) => v.vilkårType in InngangsvilkårType);
};

export const sorterUtAktivitetsvilkår = (vilkår: IVilkår): IVurdering[] => {
    return vilkår.vurderinger.filter((v) => v.vilkårType in AktivitetsvilkårType);
};

export const sorterUtBarnetilsynsvilkår = (vilkår: IVilkår): IVurdering[] => {
    return vilkår.vurderinger.filter((v) => v.vilkårType in BarnetilsynsvilkårType);
};

export const sorterUtTidligereVedtaksvilkår = (vilkår: IVilkår): IVurdering[] => {
    return vilkår.vurderinger.filter((v) => v.vilkårType in TidligereVedtaksperioderType);
};

export const erAlleVilkårOppfylt = (vilkår: IVilkår): boolean => {
    const alleOppfyltBortsettFraBarn = vilkår.vurderinger.every((vurdering: IVurdering) => {
        if (vurdering.barnId === undefined || vurdering.barnId === null) {
            return vurdering.resultat === Vilkårsresultat.OPPFYLT;
        } else {
            return true;
        }
    });

    const listeAvBarnIder = vilkår.vurderinger
        .filter((vurdering) => vurdering.barnId)
        .map((vurdering) => vurdering.barnId);

    const minstEttBarnOppfylt = listeAvBarnIder.some((barnId) =>
        vilkår.vurderinger
            .filter((vurdering) => vurdering.barnId === barnId)
            .every((vurdering) => vurdering.resultat === Vilkårsresultat.OPPFYLT)
    );

    return alleOppfyltBortsettFraBarn && (minstEttBarnOppfylt || listeAvBarnIder.length === 0);
};

export const eksistererIkkeOppfyltVilkårForOvergangsstønad = (vilkår: IVilkår): boolean => {
    const vurderinger = mapFraVilkårTilVurderinger(vilkår);
    const vilkårsresultatAleneomsorg = vurderinger
        .filter((vurdering) => vurdering.vilkårType === InngangsvilkårType.ALENEOMSORG)
        .map((v) => v.resultat);
    const vurderingerUtenAleneomsorg = vurderinger.filter(
        (vurdering) => vurdering.vilkårType !== InngangsvilkårType.ALENEOMSORG
    );
    const resultater = mapVilkårtypeTilResultat(vurderingerUtenAleneomsorg);

    return (
        eksistererVilkårsResultat(resultater, Vilkårsresultat.IKKE_OPPFYLT) ||
        vilkårStatusForBarn(vilkårsresultatAleneomsorg) === Vilkårsresultat.IKKE_OPPFYLT
    );
};

export const utledHjelpetekstForBeløpFørFratrekkOgSatsjustering = (
    antallBarn: number,
    beløpFørFratrekkOgSatsjustering: number,
    sats: number
): string => {
    const innskuttSetning = antallBarn >= 3 ? 'eller flere' : '';
    return `Beløpet er redusert fra ${beløpFørFratrekkOgSatsjustering} kr til ${sats} kr, 
        som er maksimalt beløp pr måned for ${antallBarn} ${innskuttSetning} barn`;
};

export const utledHjelpetekstForBeløpFørFratrekkOgSatsjusteringForVedtaksside = (
    redusertPgaSats: boolean,
    redusertPgaTilleggsstønad: boolean,
    antallBarn: number,
    beløpFørFratrekkOgSatsjustering: number,
    sats: number,
    tilleggsstønad: number
): string[] => {
    const prefix =
        redusertPgaSats && redusertPgaTilleggsstønad
            ? 'Deretter har beløpet blitt'
            : 'Stønadsbeløpet er';
    const visningstekstTilleggsstønad = `${prefix} redusert med ${tilleggsstønad} kr, som allerede er utbetalt etter tilleggsstønadsforskriften.`;

    if (redusertPgaSats && redusertPgaTilleggsstønad) {
        return [
            utledHjelpetekstForBeløpFørFratrekkOgSatsjustering(
                antallBarn,
                beløpFørFratrekkOgSatsjustering,
                sats
            ),
            visningstekstTilleggsstønad,
        ];
    } else if (redusertPgaSats) {
        return [
            utledHjelpetekstForBeløpFørFratrekkOgSatsjustering(
                antallBarn,
                beløpFørFratrekkOgSatsjustering,
                sats
            ),
        ];
    }
    return [visningstekstTilleggsstønad];
};

export const blirNullUtbetalingPgaOverstigendeKontantstøtte = (
    perioder: IBeregningsperiodeBarnetilsyn[]
): boolean => {
    return perioder.every(
        (periode) =>
            periode.beregningsgrunnlag.kontantstøttebeløp >= periode.beregningsgrunnlag.utgifter
    );
};

export const skalViseNullstillVedtakKnapp = (
    vedtak: Ressurs<IVedtakForOvergangsstønad | undefined>
): boolean => vedtak.status === RessursStatus.SUKSESS && vedtak.data !== undefined;
