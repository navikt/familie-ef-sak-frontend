import { IInntektsperiode } from '../../../../../App/typer/vedtak';

export enum EInntektstype {
    DAGSATS = 'DAGSATS',
    MÅNEDSINNTEKT = 'MÅNEDSINNTEKT',
    ÅRSINNTEKT = 'ÅRSINNTEKT',
    SAMORDNINGSFRADRAG = 'SAMORDNINGSFRADRAG',
}

export const inntektsTypeTilKey: Record<EInntektstype, keyof IInntektsperiode> = {
    DAGSATS: 'dagsats',
    MÅNEDSINNTEKT: 'månedsinntekt',
    ÅRSINNTEKT: 'forventetInntekt',
    SAMORDNINGSFRADRAG: 'samordningsfradrag',
};

export const inntektsTypeTilTekst: Record<EInntektstype, string> = {
    DAGSATS: 'Dagsats',
    MÅNEDSINNTEKT: 'Månedsinntekt',
    ÅRSINNTEKT: 'Årsinntekt',
    SAMORDNINGSFRADRAG: 'Samordningsfradrag',
};
