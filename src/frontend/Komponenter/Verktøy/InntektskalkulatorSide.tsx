import React, { useEffect, useRef } from 'react';
import { genererBeregnetInntektTekst } from '../../App/hooks/useVerdierForBrev';
import { CopyButton, HStack, Textarea } from '@navikt/ds-react';
import useFieldState, { FieldState } from '../../App/hooks/felles/useFieldState';
import Inntektskalkulator from '../../Felles/Kalkulator/Inntektskalkulator';
import styled from 'styled-components';

const TextAreaLiten = styled(Textarea)`
    white-space: pre-wrap;
    word-wrap: break-word;
    width: 40rem;
`;

export const InntektskalkulatorSide: React.FC = () => {
    const kalkulatorRef = useRef<{ focus: () => void }>(null);
    const inntektBegrunnelseState: FieldState = useFieldState('');
    const leggTilBeregnetInntektTekstIBegrunnelse = (årsinntekt: number, fraOgMed?: Date) => {
        const beregnetInntektTekst = genererBeregnetInntektTekst(årsinntekt, fraOgMed);
        inntektBegrunnelseState.setValue((prevState) => prevState + beregnetInntektTekst);
    };

    const nullstillBegrunnelse = () => {
        inntektBegrunnelseState.setValue(() => '');
    };

    useEffect(() => {
        document.title = 'Inntektskalkulator';
        kalkulatorRef.current?.focus();
    }, []);

    return (
        <>
            <Inntektskalkulator
                ref={kalkulatorRef}
                leggTilBeregnetInntektTekstIBegrunnelse={leggTilBeregnetInntektTekstIBegrunnelse}
                nullstillBegrunnelse={nullstillBegrunnelse}
            />
            <HStack gap="2">
                <TextAreaLiten
                    value={inntektBegrunnelseState.value}
                    onChange={(event) => {
                        inntektBegrunnelseState.onChange(event);
                    }}
                    label=""
                />
                <CopyButton
                    size={'xsmall'}
                    copyText={inntektBegrunnelseState.value}
                    variant={'action'}
                    activeText={'kopiert'}
                />
            </HStack>
        </>
    );
};
