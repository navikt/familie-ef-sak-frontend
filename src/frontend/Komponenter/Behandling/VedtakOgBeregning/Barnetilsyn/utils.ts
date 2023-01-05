import { IVilkår, Vilkårsresultat } from '../../Inngangsvilkår/vilkår';
import { IInnvilgeVedtakForBarnetilsyn, IUtgiftsperiode } from '../../../../App/typer/vedtak';
import { v4 as uuidv4 } from 'uuid';
import { fyllHullMedOpphør, revurderFraInitPeriode } from './revurderFraUtils';

export const barnSomOppfyllerAlleVilkår = (vilkår: IVilkår) => {
    const barnSomIkkeOppfyllerVilkår = vilkår.vurderinger
        .filter(
            (vurdering) =>
                vurdering.resultat !== Vilkårsresultat.OPPFYLT &&
                vurdering.resultat !== Vilkårsresultat.AUTOMATISK_OPPFYLT
        )
        .map((vurdering) => vurdering.barnId);

    return vilkår.grunnlag.barnMedSamvær.filter(
        (barn) => !barnSomIkkeOppfyllerVilkår.includes(barn.barnId)
    );
};

export const tomUtgiftsperiodeRad = (årMånedFra?: string): IUtgiftsperiode => ({
    årMånedFra: årMånedFra || '',
    årMånedTil: '',
    barn: [],
    utgifter: undefined,
    erMidlertidigOpphør: false,
    endretKey: uuidv4(),
});

export const oppdaterVedtakMedInitPeriodeOgOpphørshulll = (
    vedtak: IInnvilgeVedtakForBarnetilsyn | undefined,
    revurderesFra: string | undefined
): IInnvilgeVedtakForBarnetilsyn | undefined => {
    if (!vedtak || !revurderesFra) {
        return vedtak;
    }
    return {
        ...vedtak,
        perioder: [
            ...revurderFraInitPeriode(vedtak, revurderesFra),
            ...vedtak.perioder.reduce(fyllHullMedOpphør, [] as IUtgiftsperiode[]),
        ],
    };
};

export const oppdaterVedtakMedEndretKey = (
    vedtak: IInnvilgeVedtakForBarnetilsyn | undefined
): IInnvilgeVedtakForBarnetilsyn | undefined => {
    if (!vedtak) {
        return vedtak;
    }
    return {
        ...vedtak,
        perioder: vedtak.perioder.map((periode) => ({ ...periode, endretKey: uuidv4() })),
        perioderKontantstøtte: vedtak.perioderKontantstøtte.map((periode) => ({
            ...periode,
            endretKey: uuidv4(),
        })),
        tilleggsstønad: {
            ...vedtak.tilleggsstønad,
            perioder: vedtak.tilleggsstønad.perioder.map((periode) => ({
                ...periode,
                endretKey: uuidv4(),
            })),
        },
    };
};
