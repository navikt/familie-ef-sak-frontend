import { avslagÅrsakTilTekst, EAvslagÅrsak, årsakerTilAvslag } from '../../../../App/typer/vedtak';
import React from 'react';
import styled from 'styled-components';
import { FamilieSelect } from '@navikt/familie-form-elements';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import { VEDTAK_OG_BEREGNING } from '..//konstanter';
import { useApp } from '../../../../App/context/AppContext';
import { Element } from 'nav-frontend-typografi';

interface Props {
    avslagÅrsak?: EAvslagÅrsak;
    settAvslagÅrsak: (val: EAvslagÅrsak) => void;
}

const StyledSelect = styled(FamilieSelect)`
    max-width: 200px;
    .skjemaelement__label {
        font-size: 1.25rem;
        line-height: 1.5625rem;
    }
    margin-top: 0.6rem;
    margin-bottom: 1rem;
`;

const SelectAvslagÅrsak = (props: Props): JSX.Element => {
    const { behandlingErRedigerbar } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();
    const { avslagÅrsak, settAvslagÅrsak } = props;

    return (
        <>
            <Element>Årsak</Element>
            <StyledSelect
                value={avslagÅrsak}
                erLesevisning={!behandlingErRedigerbar}
                onChange={(e) => {
                    settAvslagÅrsak(e.target.value as EAvslagÅrsak);
                    settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                }}
                lesevisningVerdi={avslagÅrsak && avslagÅrsakTilTekst[avslagÅrsak]}
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
        </>
    );
};

export default SelectAvslagÅrsak;
