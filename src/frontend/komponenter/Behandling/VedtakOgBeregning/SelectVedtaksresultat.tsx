import { EBehandlingResultat } from '../../../typer/vedtak';
import React from 'react';
import styled from 'styled-components';
import { Select } from 'nav-frontend-skjema';

interface Props {
    resultatType?: EBehandlingResultat;
    settResultatType: (val: EBehandlingResultat) => void;
}

const StyledSelect = styled(Select)`
    max-width: 200px;
`;

const SelectVedtaksresultat = (props: Props): JSX.Element => {
    const { resultatType, settResultatType } = props;
    return (
        <>
            <StyledSelect
                label="Vedtak"
                value={resultatType}
                onChange={(e) => settResultatType(e.target.value as EBehandlingResultat)}
            >
                <option value="">Velg</option>
                <option value={EBehandlingResultat.INNVILGE}>Innvilge</option>
                <option value={EBehandlingResultat.AVSLÅ}>Avslå</option>
                <option value={EBehandlingResultat.HENLEGGE} disabled>
                    Henlegge
                </option>
                <option value={EBehandlingResultat.BEHANDLE_I_GOSYS}>Behandle i Gosys</option>
            </StyledSelect>
        </>
    );
};

export default SelectVedtaksresultat;
