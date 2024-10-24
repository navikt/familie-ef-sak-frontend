import { CalculatorIcon } from '@navikt/aksel-icons';
import { Dropdown, Button, HStack } from '@navikt/ds-react';
import React, { FC, useEffect, useRef, useState } from 'react';
import { BodyShortSmall } from '../../../../../Felles/Visningskomponenter/Tekster';
import styled from 'styled-components';
import ForwardedTextField from './ForwardedTextField';

const StyledDropdownMenu = styled(Dropdown.Menu)`
    width: 23rem;
`;

const BeregnetInntektKalkulator: FC<{
    leggTilBeregnetInntektTekstIBegrunnelse: (beregnetInntekt: {
        årsinntekt: number;
        minusTi: number;
        plussTi: number;
    }) => void;
}> = ({ leggTilBeregnetInntektTekstIBegrunnelse }) => {
    const [årsinntekt, settÅrsinntekt] = useState<string>('');
    const textFieldRef = useRef<HTMLInputElement>(null);
    const [erDropdownÅpen, settErDropdownÅpen] = useState<boolean>(false);

    const regnUtInntektOgLeggTilTekst = () => {
        const årsinntektTall = parseFloat(årsinntekt);

        const månedsinntekt = årsinntektTall / 12;
        const minusTi = Math.round(månedsinntekt * 0.9);
        const plusTi = Math.round(månedsinntekt * 1.1);

        leggTilBeregnetInntektTekstIBegrunnelse({
            årsinntekt: årsinntektTall,
            minusTi: minusTi,
            plussTi: plusTi,
        });
    };

    const handleOnClick = () => {
        settErDropdownÅpen(!erDropdownÅpen);
    };

    const handleRegnUtOgLeggTilTekst = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            regnUtInntektOgLeggTilTekst();
        }
    };

    useEffect(() => {
        if (textFieldRef.current) {
            textFieldRef.current.focus();
        }
    }, [erDropdownÅpen]);

    return (
        <Dropdown>
            <Button type="button" as={Dropdown.Toggle} size="small" onClick={handleOnClick}>
                <CalculatorIcon title="åpne " fontSize="1.5rem" />
            </Button>
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
                        onChange={(e) => settÅrsinntekt(e.target.value)}
                        onKeyDown={handleRegnUtOgLeggTilTekst}
                    />

                    <Button
                        type="button"
                        variant="secondary"
                        size="xsmall"
                        onClick={() => regnUtInntektOgLeggTilTekst()}
                    >
                        Regn ut
                    </Button>
                </HStack>
            </StyledDropdownMenu>
        </Dropdown>
    );
};

export default BeregnetInntektKalkulator;
