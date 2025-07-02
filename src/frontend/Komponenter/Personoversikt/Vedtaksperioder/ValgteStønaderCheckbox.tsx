import { HStack, CheckboxGroup, Checkbox } from '@navikt/ds-react';
import React, { FC } from 'react';
import { harBehandling, ValgtStønad } from './utils';

const ValgteStønaderCheckbox: FC<{
    valgteStønader: ValgtStønad[];
    settValgteStønader: React.Dispatch<React.SetStateAction<ValgtStønad[]>>;
    stønaderMedBehandling: ValgtStønad[];
    skalViseInfotrygd: boolean;
    settSkalViseInfotrygd: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({
    valgteStønader,
    settValgteStønader,
    stønaderMedBehandling,
    skalViseInfotrygd,
    settSkalViseInfotrygd,
}) => {
    const handleValgteStønader = (valg: ValgtStønad) => {
        settValgteStønader((prevState) => {
            if (prevState.includes(valg)) {
                return prevState.filter((stønad) => stønad !== valg);
            }

            return [...prevState, valg];
        });
    };

    return (
        <HStack gap={'16'}>
            <HStack gap={'4'}>
                <CheckboxGroup
                    size="small"
                    legend=""
                    hideLegend
                    disabled={!harBehandling(stønaderMedBehandling, ValgtStønad.OVERGANGSSTØNAD)}
                    value={valgteStønader}
                    onChange={() => handleValgteStønader(ValgtStønad.OVERGANGSSTØNAD)}
                >
                    <Checkbox value="overgangsstønad">Overgangsstønad</Checkbox>
                </CheckboxGroup>
                <CheckboxGroup
                    size="small"
                    legend=""
                    hideLegend
                    disabled={!harBehandling(stønaderMedBehandling, ValgtStønad.BARNETILSYN)}
                    value={valgteStønader}
                    onChange={() => handleValgteStønader(ValgtStønad.BARNETILSYN)}
                >
                    <Checkbox value="barnetilsyn">Barnetilsyn</Checkbox>
                </CheckboxGroup>
                <CheckboxGroup
                    size="small"
                    legend=""
                    hideLegend
                    disabled={!harBehandling(stønaderMedBehandling, ValgtStønad.SKOLEPENGER)}
                    value={valgteStønader}
                    onChange={() => handleValgteStønader(ValgtStønad.SKOLEPENGER)}
                >
                    <Checkbox value="skolepenger">Skolepenger</Checkbox>
                </CheckboxGroup>
            </HStack>
            <CheckboxGroup
                size="small"
                legend=""
                hideLegend
                value={skalViseInfotrygd ? ['infotrygd'] : []}
                onChange={(values) => settSkalViseInfotrygd(values.includes('infotrygd'))}
            >
                <Checkbox value="infotrygd">Infotrygd</Checkbox>
            </CheckboxGroup>
        </HStack>
    );
};

export default ValgteStønaderCheckbox;
