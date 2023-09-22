import {
    avslagÅrsakTilTekst,
    EAvslagÅrsak,
    årsakerTilAvslag,
} from '../../../../../App/typer/vedtak';
import React from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { VEDTAK_OG_BEREGNING } from '../konstanter';
import { useApp } from '../../../../../App/context/AppContext';
import { EnsligFamilieSelect } from '../../../../../Felles/Input/EnsligFamilieSelect';
import { BodyShortSmall } from '../../../../../Felles/Visningskomponenter/Tekster';

interface Props {
    avslagÅrsak?: EAvslagÅrsak;
    settAvslagÅrsak: (val: EAvslagÅrsak) => void;
    feilmelding: string;
}

const StyledSelect = styled(EnsligFamilieSelect)`
    max-width: 200px;
    margin-top: 0.6rem;
    margin-bottom: 1rem;
`;

const FeilmeldingTekst = styled(BodyShortSmall)`
    margin-top: 0;
    margin-bottom: 2rem;
    font-weight: 600;
    color: #ba3a26;
`;

const SelectAvslagÅrsak = (props: Props): JSX.Element => {
    const { behandlingErRedigerbar } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();
    const { avslagÅrsak, settAvslagÅrsak, feilmelding } = props;

    return (
        <>
            <StyledSelect
                value={avslagÅrsak}
                erLesevisning={!behandlingErRedigerbar}
                onChange={(e) => {
                    settAvslagÅrsak(e.target.value as EAvslagÅrsak);
                    settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                }}
                lesevisningVerdi={avslagÅrsak && avslagÅrsakTilTekst[avslagÅrsak]}
                label={'Årsak avslag'}
                hideLabel={false}
            >
                <option value="">Velg</option>
                {årsakerTilAvslag.map((årsak) => {
                    return (
                        <option value={årsak} key={årsak}>
                            {avslagÅrsakTilTekst[årsak]}
                        </option>
                    );
                })}
            </StyledSelect>
            {feilmelding && <FeilmeldingTekst>{feilmelding}</FeilmeldingTekst>}
        </>
    );
};

export default SelectAvslagÅrsak;
