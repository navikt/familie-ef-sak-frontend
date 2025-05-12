import React, { useEffect } from 'react';
import { genererBeregnetInntektsTekst } from '../../App/hooks/useVerdierForBrev';
import { Textarea } from '@navikt/ds-react';
import useFieldState, { FieldState } from '../../App/hooks/felles/useFieldState';
import Inntektskalkulator from '../../Felles/Kalkulator/Inntektskalkulator';
import styled from 'styled-components';

const TextAreaLiten = styled(Textarea)`
    white-space: pre-wrap;
    word-wrap: break-word;
    max-width: 40rem;
`;

export const InntektskalkulatorSide: React.FC = () => {
    const inntektBegrunnelseState: FieldState = useFieldState('');
    const leggTilBeregnetInntektTekstIBegrunnelse = (årsinntekt: number) => {
        const beregnetInntektTekst = genererBeregnetInntektsTekst(årsinntekt);
        inntektBegrunnelseState.setValue((prevState) => prevState + beregnetInntektTekst);
    };

    const nullstillBegrunnelse = () => {
        inntektBegrunnelseState.setValue(() => '');
    };

    useEffect(() => {
        document.title = 'Inntektskalkulator';
    }, []);

    return (
        <>
            <Inntektskalkulator
                leggTilBeregnetInntektTekstIBegrunnelse={leggTilBeregnetInntektTekstIBegrunnelse}
                nullstillBegrunnelse={nullstillBegrunnelse}
            />
            <TextAreaLiten
                value={inntektBegrunnelseState.value}
                onChange={(event) => {
                    inntektBegrunnelseState.onChange(event);
                }}
                label=""
                maxLength={0}
            />
        </>
    );
};
