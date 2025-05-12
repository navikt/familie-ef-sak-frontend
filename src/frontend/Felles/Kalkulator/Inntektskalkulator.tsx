import { Button, HStack, VStack } from '@navikt/ds-react';
import React, { FC, useRef, useState } from 'react';
import { BodyShortSmall } from '../Visningskomponenter/Tekster';
import ForwardedTextField from '../../Komponenter/Behandling/VedtakOgBeregning/Overgangsstønad/InnvilgeVedtak/ForwardedTextField';
import { EnsligErrorMessage } from '../ErrorMessage/EnsligErrorMessage';

const TASTATURTAST_ENTER = 'Enter';

const Inntektskalkulator: FC<{
    leggTilBeregnetInntektTekstIBegrunnelse: (årsinntekt: number) => void;
    nullstillBegrunnelse?: () => void;
}> = ({ leggTilBeregnetInntektTekstIBegrunnelse, nullstillBegrunnelse }) => {
    const [årsinntekt, settÅrsinntekt] = useState<string>('');
    const textFieldRef = useRef<HTMLInputElement>(null);
    const [feilmedling, settFeilmedling] = useState<string>('');

    const oppdaterÅrsinntekt = () => {
        settFeilmedling('');
        const årsinntektTall = parseFloat(årsinntekt);

        if (isNaN(årsinntektTall)) {
            settFeilmedling('Årsinntekt må være et tall');
            return;
        }

        leggTilBeregnetInntektTekstIBegrunnelse(årsinntektTall);
        settÅrsinntekt('');
    };

    const handleRegnUtOgLeggTilTekst = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === TASTATURTAST_ENTER) {
            event.preventDefault();
            oppdaterÅrsinntekt();
        }
    };

    const handleTextFieldOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        settÅrsinntekt(value);

        if (!isNaN(parseFloat(value))) {
            settFeilmedling('');
        }
    };

    const nullstillKalkulator = () => {
        if (nullstillBegrunnelse !== undefined) {
            nullstillBegrunnelse();
        }
        settÅrsinntekt('');
    };

    return (
        <VStack gap="3">
            <BodyShortSmall>Legg inn årsinntekt for å regne ut +/- 10 prosent.</BodyShortSmall>
            <HStack gap="4" justify={nullstillBegrunnelse ? 'start' : 'space-between'}>
                <ForwardedTextField
                    ref={textFieldRef}
                    placeholder="Årsinntekt"
                    type="number"
                    inputMode="numeric"
                    label=""
                    size="small"
                    value={årsinntekt}
                    onChange={handleTextFieldOnChange}
                    onKeyDown={handleRegnUtOgLeggTilTekst}
                />

                <Button
                    type="button"
                    variant="secondary"
                    size="xsmall"
                    onClick={oppdaterÅrsinntekt}
                >
                    Beregn
                </Button>
                {nullstillBegrunnelse !== undefined && (
                    <Button
                        type="button"
                        variant="tertiary"
                        size="xsmall"
                        onClick={nullstillKalkulator}
                    >
                        Nullstill
                    </Button>
                )}
                <EnsligErrorMessage>{feilmedling}</EnsligErrorMessage>
            </HStack>
        </VStack>
    );
};

export default Inntektskalkulator;
