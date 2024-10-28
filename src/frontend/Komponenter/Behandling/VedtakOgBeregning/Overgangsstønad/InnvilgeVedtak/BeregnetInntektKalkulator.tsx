import { CalculatorIcon } from '@navikt/aksel-icons';
import { Dropdown, Button, HStack, Tooltip } from '@navikt/ds-react';
import React, { FC, useEffect, useRef, useState } from 'react';
import { BodyShortSmall } from '../../../../../Felles/Visningskomponenter/Tekster';
import styled from 'styled-components';
import ForwardedTextField from './ForwardedTextField';
import { EnsligErrorMessage } from '../../../../../Felles/ErrorMessage/EnsligErrorMessage';

const StyledDropdownMenu = styled(Dropdown.Menu)`
    width: 23rem;
`;

const erMac = /Mac/.test(navigator.userAgent);

const TASTATURTAST_K = 'k';
const TASTATURTAST_META = erMac ? 'cmd' : 'ctrl';
const TASTATURTAST_SHIFT = 'Shift';

const BeregnetInntektKalkulator: FC<{
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
        if (event.key === 'Enter') {
            event.preventDefault();
            oppdaterÅrsinntekt();
        }
    };

    const handleOnOpenChange = (erÅpen: boolean) => {
        settErDropdownÅpen(erÅpen);
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
                event.metaKey &&
                event.getModifierState(TASTATURTAST_SHIFT) &&
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
        <Dropdown open={erDropdownÅpen} onOpenChange={() => handleOnOpenChange(!erDropdownÅpen)}>
            <Tooltip
                content="Åpne kalkulator for beregning av forventet månedsinntekt"
                keys={[TASTATURTAST_META, TASTATURTAST_SHIFT, TASTATURTAST_K]}
            >
                <Button type="button" as={Dropdown.Toggle} size="small">
                    <CalculatorIcon aria-hidden fontSize="1.5rem" />
                </Button>
            </Tooltip>
            <StyledDropdownMenu>
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
            </StyledDropdownMenu>
        </Dropdown>
    );
};

export default BeregnetInntektKalkulator;
