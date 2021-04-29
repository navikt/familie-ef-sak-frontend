import { EBehandlingResultat, behandlingResultatTilTekst } from '../../../typer/vedtak';
import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../context/BehandlingContext';
import { FamilieSelect } from '@navikt/familie-form-elements';

interface Props {
    resultatType?: EBehandlingResultat;
    settFeilmelding: Dispatch<SetStateAction<string>>;
    settResultatType: Dispatch<SetStateAction<EBehandlingResultat | undefined>>;
}

const StyledSelect = styled(FamilieSelect)`
    max-width: 200px;
`;

const VelgVedtaksresultat = (props: Props): JSX.Element => {
    const { behandlingErRedigerbar } = useBehandling();
    const { resultatType, settFeilmelding, settResultatType } = props;
    return (
        <StyledSelect
            label="Vedtak"
            value={resultatType}
            onChange={(e) => {
                settFeilmelding('');
                settResultatType(e.target.value as EBehandlingResultat);
            }}
            erLesevisning={!behandlingErRedigerbar}
            lesevisningVerdi={resultatType && behandlingResultatTilTekst[resultatType]}
        >
            <option value="">Velg</option>
            <option value={EBehandlingResultat.INNVILGE}>
                {behandlingResultatTilTekst[EBehandlingResultat.INNVILGE]}
            </option>
            <option value={EBehandlingResultat.AVSLÅ} disabled>
                {behandlingResultatTilTekst[EBehandlingResultat.AVSLÅ]}
            </option>
            <option value={EBehandlingResultat.HENLEGGE} disabled>
                {behandlingResultatTilTekst[EBehandlingResultat.HENLEGGE]}
            </option>
            <option value={EBehandlingResultat.BEHANDLE_I_GOSYS}>
                {behandlingResultatTilTekst[EBehandlingResultat.BEHANDLE_I_GOSYS]}
            </option>
        </StyledSelect>
    );
};

export default VelgVedtaksresultat;
