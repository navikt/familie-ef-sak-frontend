import { Button, HStack } from '@navikt/ds-react';
import React, { FC, useEffect, useRef, useState } from 'react';
import { BodyShortSmall } from '../Visningskomponenter/Tekster';
import ForwardedTextField from '../../Komponenter/Behandling/VedtakOgBeregning/Overgangsstønad/InnvilgeVedtak/ForwardedTextField';
import { EnsligErrorMessage } from '../ErrorMessage/EnsligErrorMessage';

const TASTATURTAST_K = 'k';
const TASTATURTAST_ENTER = 'Enter';

const InntektsKalkulator: FC<{
    leggTilBeregnetInntektTekstIBegrunnelse: (årsinntekt: number) => void;
}> = ({ leggTilBeregnetInntektTekstIBegrunnelse }) => {
    const [årsinntekt, settÅrsinntekt] = useState<string>('');
    const textFieldRef = useRef<HTMLInputElement>(null);
    const [erDropdownÅpen, settErDropdownÅpen] = useState<boolean>(false);
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
        settErDropdownÅpen(false);
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

    useEffect(() => {
        if (textFieldRef.current) {
            textFieldRef.current.focus();
        }
    }, [erDropdownÅpen]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (
                document.activeElement === document.body &&
                !(event.target instanceof HTMLInputElement) &&
                event.key === TASTATURTAST_K
            ) {
                event.preventDefault();
                settErDropdownÅpen((prev) => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <>
            <BodyShortSmall>Legg inn årsinntekt for å regne ut +/- 10 prosent.</BodyShortSmall>
            <HStack gap="2" justify="space-between">
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
                <EnsligErrorMessage>{feilmedling}</EnsligErrorMessage>
            </HStack>
        </>
    );
};

export default InntektsKalkulator;
