import {
    IInntektsperiode,
    IInnvilgeVedtakForOvergangsstønad,
} from '../../../../../App/typer/vedtak';
import { v4 as uuidv4 } from 'uuid';
import { EInntektstype } from './InntektsperiodeValg';

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

export const initierValgteInntektstyper = (
    inntektsperioder: IInntektsperiode[]
): Record<EInntektstype, boolean> => {
    const finnesDagsats = inntektsperioder.some((periode) => periode.dagsats);
    const finnesMånedsinntekt = inntektsperioder.some((periode) => periode.månedsinntekt);
    const finnesÅrsinntekt = inntektsperioder.some((periode) => periode.forventetInntekt);
    const finnesSamordningsfradrag = inntektsperioder.some((periode) => periode.samordningsfradrag);

    return {
        DAGSATS: finnesDagsats,
        MÅNEDSINNTEKT: finnesMånedsinntekt,
        ÅRSINNTEKT: finnesÅrsinntekt,
        SAMORDNINGSFRADRAG: finnesSamordningsfradrag,
    };
};
