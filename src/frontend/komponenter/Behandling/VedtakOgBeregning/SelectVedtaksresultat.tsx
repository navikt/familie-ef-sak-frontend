import { EBehandlingResultat } from '../../../typer/vedtak';
import React from 'react';
import styled from 'styled-components';
import { FamilieSelect } from '@navikt/familie-form-elements';
import { useBehandling } from '../../../context/BehandlingContext';

interface Props {
    resultatType?: EBehandlingResultat;
    settResultatType: (val: EBehandlingResultat) => void;
}

const StyledSelect = styled(FamilieSelect)`
    max-width: 200px;
    .skjemaelement__label {
        font-size: 1.25rem;
        line-height: 1.5625rem;
    }
`;

const SelectVedtaksresultat = (props: Props): JSX.Element => {
    const { behandlingErRedigerbar } = useBehandling();
    const { resultatType, settResultatType } = props;
    return (
        <>
            <StyledSelect
                label="Vedtak"
                value={resultatType}
                erLesevisning={!behandlingErRedigerbar}
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
