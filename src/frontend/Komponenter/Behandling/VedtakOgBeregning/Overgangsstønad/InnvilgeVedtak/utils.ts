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
): EInntektstype[] => {
    const innteksttypeHvisVerdiFinnes = (
        type: EInntektstype,
        key: keyof IInntektsperiode
    ): EInntektstype[] => (inntektsperioder.some((periode) => periode[key]) ? [type] : []);

    return [
        innteksttypeHvisVerdiFinnes(EInntektstype.DAGSATS, 'dagsats'),
        innteksttypeHvisVerdiFinnes(EInntektstype.MÅNEDSINNTEKT, 'månedsinntekt'),
        innteksttypeHvisVerdiFinnes(EInntektstype.ÅRSINNTEKT, 'forventetInntekt'),
        innteksttypeHvisVerdiFinnes(EInntektstype.SAMORDNINGSFRADRAG, 'samordningsfradrag'),
    ].flatMap((e) => e);
};
