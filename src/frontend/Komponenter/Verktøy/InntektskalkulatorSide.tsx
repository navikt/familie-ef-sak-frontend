import React from 'react';
import BeregnetInntektKalkulator from '../Behandling/VedtakOgBeregning/Overgangsstønad/InnvilgeVedtak/BeregnetInntektKalkulator';
import { genererBeregnetInntektsTekst } from '../../App/hooks/useVerdierForBrev';
import useFieldState, { FieldState } from '../../App/hooks/felles/useFieldState';
import { EnsligTextArea } from '../../Felles/Input/TekstInput/EnsligTextArea';

export const InntektskalkulatorSide: React.FC = () => {
    const inntektBegrunnelseState: FieldState = useFieldState('');
    const leggTilBeregnetInntektTekstIBegrunnelse = (årsinntekt: number) => {
        const beregnetInntektTekst = genererBeregnetInntektsTekst(årsinntekt);
        inntektBegrunnelseState.setValue((prevState) => prevState + beregnetInntektTekst);
    };
    return (
        <div>
            <BeregnetInntektKalkulator
                leggTilBeregnetInntektTekstIBegrunnelse={leggTilBeregnetInntektTekstIBegrunnelse}
            />
            <EnsligTextArea
                value={inntektBegrunnelseState.value}
                onChange={(event) => {
                    inntektBegrunnelseState.onChange(event);
                }}
                label="Beregnet inntekt"
                maxLength={0}
            />
        </div>
    );
};
