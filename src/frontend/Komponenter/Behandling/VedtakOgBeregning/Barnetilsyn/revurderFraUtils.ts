import { v4 as uuidv4 } from 'uuid';
import { IUtgiftsperiode, IvedtakForBarnetilsyn } from '../../../../App/typer/vedtak';
import { månedÅrTilDate, plusMåneder, tilÅrMåned } from '../../../../App/utils/dato';
import { tomUtgiftsperiodeRad } from './utils';

const lagMidlertidigOpphør = (fra: string, til: string): IUtgiftsperiode => ({
    årMånedFra: fra,
    årMånedTil: til,
    barn: [],
    utgifter: undefined,
    erMidlertidigOpphør: true,
    endretKey: uuidv4(),
});
/**
 * Fyller hull mellom 2 perioder med midlertidig opphør
 * Sjekker om forrige sin tildato plus en måned er den samme måneden som neste periode sin fra-måned
 */
export const fyllHullMedOpphør = (
    acc: IUtgiftsperiode[],
    periode: IUtgiftsperiode
): IUtgiftsperiode[] => {
    const forrige = acc[acc.length - 1];
    if (forrige && forrige.årMånedTil && periode.årMånedFra) {
        const hullFra = tilÅrMåned(plusMåneder(månedÅrTilDate(forrige.årMånedTil), 1));
        const hullTil = tilÅrMåned(plusMåneder(månedÅrTilDate(periode.årMånedFra), -1));
        if (hullFra !== periode.årMånedFra) {
            acc.push(lagMidlertidigOpphør(hullFra, hullTil));
        }
    }
    acc.push(periode);
    return acc;
};

/**
 * Lager en periode som legges før tidligere perioder hvis revurderes fra er før tidligere dato
 */
export const revurderFraInitPeriode = (
    vedtakshistorikk: IvedtakForBarnetilsyn,
    revurderesFra: string
): IUtgiftsperiode[] => {
    const manglerPerioder = vedtakshistorikk.perioder.length === 0;
    const erFørFørstePeriode = revurdererFørFørstePeriode(vedtakshistorikk, revurderesFra);
    return erFørFørstePeriode || manglerPerioder ? [tomUtgiftsperiodeRad(revurderesFra)] : [];
};

export const revurdererFørFørstePeriode = (
    vedtakshistorikk: IvedtakForBarnetilsyn | undefined,
    revurderesFra: string | undefined
): boolean => {
    const fraOgMedDato = vedtakshistorikk?.perioder[0]?.årMånedFra;
    return !!revurderesFra && !!fraOgMedDato && revurderesFra < fraOgMedDato;
};
