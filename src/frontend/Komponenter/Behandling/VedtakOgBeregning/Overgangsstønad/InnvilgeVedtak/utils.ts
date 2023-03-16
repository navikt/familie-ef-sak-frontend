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
    const finnesÅrsinntekt =
        inntektsperioder.filter((periode) => periode.forventetInntekt).length > 0;

    return {
        DAGSATS: false,
        MÅNEDSINNTEKT: false,
        ÅRSINNTEKT: finnesÅrsinntekt,
        SAMORDNINGSFRADRAG: false,
    };
};
