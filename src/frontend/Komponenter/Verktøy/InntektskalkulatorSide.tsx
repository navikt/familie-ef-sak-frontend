import React, { useEffect } from 'react';
import { genererBeregnetInntektsTekst } from '../../App/hooks/useVerdierForBrev';
import { Button } from '@navikt/ds-react';
import useFieldState, { FieldState } from '../../App/hooks/felles/useFieldState';
import InntektsKalkulator from '../../Felles/Kalkulator/Inntektskalkulator';
import { EnsligTextArea } from '../../Felles/Input/TekstInput/EnsligTextArea';

export const InntektskalkulatorSide: React.FC = () => {
    const inntektBegrunnelseState: FieldState = useFieldState('');
    const leggTilBeregnetInntektTekstIBegrunnelse = (årsinntekt: number) => {
        const beregnetInntektTekst = genererBeregnetInntektsTekst(årsinntekt);
        inntektBegrunnelseState.setValue((prevState) => prevState + beregnetInntektTekst);
    };

    const nullstillKalkulator = () => {
        inntektBegrunnelseState.setValue(() => '');
    };

    useEffect(() => {
        document.title = 'Inntektskalkulator';
    }, []);

    return (
        <>
            <InntektsKalkulator
                leggTilBeregnetInntektTekstIBegrunnelse={leggTilBeregnetInntektTekstIBegrunnelse}
            />
            <Button type="button" variant="tertiary" size="xsmall" onClick={nullstillKalkulator}>
                Nullstill
            </Button>
            <EnsligTextArea
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
