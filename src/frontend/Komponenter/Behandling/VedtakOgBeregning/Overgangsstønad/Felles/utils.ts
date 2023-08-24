import {
    EAktivitet,
    EPeriodetype,
    IInntektsperiode,
    IInnvilgeVedtakForOvergangsstønad,
    IVedtaksperiode,
} from '../../../../../App/typer/vedtak';
import { v4 as uuidv4 } from 'uuid';
import { EInntektstype, inntektsTypeTilKey } from './typer';
import { fyllHullMedOpphør, revurderFraInitPeriode } from './revurderFraUtils';

export const tomVedtaksperiodeRad = (årMånedFra?: string): IVedtaksperiode => ({
    periodeType: '' as EPeriodetype,
    aktivitet: '' as EAktivitet,
    årMånedFra: årMånedFra,
    endretKey: uuidv4(),
});

export const tomInntektsperiodeRad = (årMånedFra?: string): IInntektsperiode => ({
    årMånedFra: årMånedFra || '',
    endretKey: uuidv4(),
});

export const oppdaterVedtakMedInitPeriodeOgOpphørshull = (
    vedtak: IInnvilgeVedtakForOvergangsstønad | undefined,
    revurderesFra: string | undefined
): IInnvilgeVedtakForOvergangsstønad | undefined => {
    if (!vedtak || !revurderesFra) {
        return vedtak;
    }
    return {
        ...vedtak,
        perioder: [
            ...revurderFraInitPeriode(vedtak, revurderesFra, tomVedtaksperiodeRad),
            ...vedtak.perioder.reduce(fyllHullMedOpphør, [] as IVedtaksperiode[]),
        ],
        inntekter: [
            ...revurderFraInitPeriode(vedtak, revurderesFra, tomInntektsperiodeRad),
            ...vedtak.inntekter,
        ],
    };
};

export const oppdaterVedtakMedEndretKey = (
    vedtak: IInnvilgeVedtakForOvergangsstønad | undefined
): IInnvilgeVedtakForOvergangsstønad | undefined => {
    if (!vedtak) {
        return vedtak;
    }
    return {
        ...vedtak,
        perioder: vedtak.perioder.map((periode) => ({ ...periode, endretKey: uuidv4() })),
        inntekter: vedtak.inntekter.map((inntekt) => ({ ...inntekt, endretKey: uuidv4() })),
    };
};

const innteksttypeHvisVerdiFinnes = (
    type: EInntektstype,
    key: keyof IInntektsperiode,
    inntektsperioder: IInntektsperiode[]
): EInntektstype[] => (inntektsperioder.some((periode) => periode[key]) ? [type] : []);

export const initierValgteInntektstyper = (inntektsperioder: IInntektsperiode[]): EInntektstype[] =>
    Object.entries(inntektsTypeTilKey).flatMap(([type, key]) =>
        innteksttypeHvisVerdiFinnes(type as EInntektstype, key, inntektsperioder)
    );
