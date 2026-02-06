import { CalculatorIcon } from '@navikt/aksel-icons';
import { Dropdown, Button, Tooltip } from '@navikt/ds-react';
import React, { FC, useEffect, useRef, useState } from 'react';
import Inntektskalkulator from '../../../../../Felles/Kalkulator/Inntektskalkulator';

const TASTATURTAST_K = 'k';

const BeregnetInntektKalkulator: FC<{
    leggTilBeregnetInntektTekstIBegrunnelse: (årsinntekt: number, fraOgMed?: Date) => void;
}> = ({ leggTilBeregnetInntektTekstIBegrunnelse }) => {
    const kalkulatorRef = useRef<{ focus: () => void }>(null);
    const [erDropdownÅpen, settErDropdownÅpen] = useState<boolean>(false);

    const handleOnOpenChange = (erÅpen: boolean) => {
        settErDropdownÅpen(erÅpen);
    };

    useEffect(() => {
        if (erDropdownÅpen && kalkulatorRef.current) {
            setTimeout(() => {
                kalkulatorRef.current?.focus();
            }, 0);
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
        <Dropdown open={erDropdownÅpen} onOpenChange={() => handleOnOpenChange(!erDropdownÅpen)}>
            <Tooltip
                content="Åpne kalkulator for beregning av forventet månedsinntekt"
                keys={[TASTATURTAST_K]}
            >
                <Button type="button" as={Dropdown.Toggle} size="small">
                    <CalculatorIcon aria-hidden fontSize="1.5rem" />
                </Button>
            </Tooltip>
            <Dropdown.Menu
                style={{
                    width: '32rem',
                    overflow: 'visible',
                }}
            >
                <Inntektskalkulator
                    ref={kalkulatorRef}
                    leggTilBeregnetInntektTekstIBegrunnelse={
                        leggTilBeregnetInntektTekstIBegrunnelse
                    }
                />
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default BeregnetInntektKalkulator;
