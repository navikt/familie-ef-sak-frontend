import { tomVedtaksperiodeRad } from './VedtaksperiodeValg';
import { IVedtakshistorikk, IVedtaksperiode } from '../../../../../App/typer/vedtak';

/**
 * Lager en periode som legges før tidligere vedtaksperioder hvis revurderes fra er før tidligere dato
 */
export const revurderFraInitPeriode = (
    vedtakshistorikk: IVedtakshistorikk,
    revurderesFra: string | undefined
): IVedtaksperiode[] => {
    const manglerPerioder = vedtakshistorikk.perioder.length === 0;
    const fraOgMedDato = vedtakshistorikk.perioder[0]?.årMånedFra;
    const erFørFørstePeriode = revurderesFra && fraOgMedDato && revurderesFra < fraOgMedDato;

    return erFørFørstePeriode || manglerPerioder ? [tomVedtaksperiodeRad(revurderesFra)] : [];
};
