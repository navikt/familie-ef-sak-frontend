import { EBehandlingResultat } from '../../../typer/vedtak';
import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { Select } from 'nav-frontend-skjema';

interface Props {
    resultatType?: EBehandlingResultat;
    settFeilmelding: Dispatch<SetStateAction<string>>;
    settResultatType: Dispatch<SetStateAction<EBehandlingResultat | undefined>>;
}

const StyledSelect = styled(Select)`
    max-width: 200px;
`;

const VelgVedtaksresultat = (props: Props) => {
    const { resultatType, settFeilmelding, settResultatType } = props;
    return (
        <StyledSelect
            label="Vedtak"
            value={resultatType}
            onChange={(e) => {
                settFeilmelding('');
                settResultatType(e.target.value as EBehandlingResultat);
            }}
        >
            <option value="">Velg</option>
            <option value={EBehandlingResultat.INNVILGE}>Innvilge</option>
            <option value={EBehandlingResultat.AVSLÅ} disabled>
                Avslå
            </option>
            <option value={EBehandlingResultat.HENLEGGE} disabled>
                Henlegge
            </option>
            <option value={EBehandlingResultat.BEHANDLE_I_GOSYS}>Behandle i Gosys</option>
        </StyledSelect>
    );
};

export default VelgVedtaksresultat;
