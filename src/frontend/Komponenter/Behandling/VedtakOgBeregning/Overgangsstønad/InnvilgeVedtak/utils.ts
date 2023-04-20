import {
    IInntektsperiode,
    IInnvilgeVedtakForOvergangsstønad,
} from '../../../../../App/typer/vedtak';
import { v4 as uuidv4 } from 'uuid';
import { EInntektstype, inntektsTypeTilKey } from './typer';

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
