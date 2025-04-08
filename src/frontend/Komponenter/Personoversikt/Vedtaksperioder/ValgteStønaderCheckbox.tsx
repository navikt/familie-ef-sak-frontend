import { HStack, CheckboxGroup, Checkbox } from '@navikt/ds-react';
import React, { FC } from 'react';

export type ValgtStønad = 'overgangsstønad' | 'barnetilsyn' | 'skolepenger';

const ValgteStønaderCheckbox: FC<{
    valgteStønader: ValgtStønad[];
    settValgteStønader: React.Dispatch<React.SetStateAction<ValgtStønad[]>>;
}> = ({ valgteStønader, settValgteStønader }) => {
    const handleValgteStønader = (val: ValgtStønad) => {
        settValgteStønader((prevState) => {
            if (prevState.includes(val)) {
                return prevState.filter((stønad) => stønad !== val);
            }

            return [...prevState, val];
        });
    };
    return (
        <HStack gap={'4'}>
            <CheckboxGroup
                legend=""
                hideLegend
                value={valgteStønader}
                onChange={() => handleValgteStønader('overgangsstønad')}
            >
                <Checkbox value="overgangsstønad">Overgangsstønad</Checkbox>
            </CheckboxGroup>
            <CheckboxGroup
                legend=""
                hideLegend
                value={valgteStønader}
                onChange={() => handleValgteStønader('barnetilsyn')}
            >
                <Checkbox value="barnetilsyn">Barnetilsyn</Checkbox>
            </CheckboxGroup>
            <CheckboxGroup
                legend=""
                hideLegend
                value={valgteStønader}
                onChange={() => handleValgteStønader('skolepenger')}
            >
                <Checkbox value="skolepenger">Skolepenger</Checkbox>
            </CheckboxGroup>
        </HStack>
    );
};

export default ValgteStønaderCheckbox;
