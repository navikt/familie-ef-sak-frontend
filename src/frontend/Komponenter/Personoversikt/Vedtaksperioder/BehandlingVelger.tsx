import { Select, Checkbox, HStack } from '@navikt/ds-react';
import React, { FC } from 'react';
import styled from 'styled-components';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import { behandlingstypeTilTekst } from '../../../App/typer/behandlingstype';
import { formaterNullableIsoDatoTid } from '../../../App/utils/formatter';
import { Behandling, Fagsak } from '../../../App/typer/fagsak';

const BehandlingSelect = styled(Select)`
    width: 22rem;
    padding-top: 0.75rem;
`;

const StyledCheckbox = styled(Checkbox)`
    align-content: end;
`;

const BehandlingVelger: FC<{
    valgtFagsak: Fagsak | undefined;
    behandlinger: Behandling[];
    settValgtBehandlingId: React.Dispatch<React.SetStateAction<string | undefined>>;
    visUaktuelle: boolean;
    settVisUaktuelle: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ valgtFagsak, behandlinger, settValgtBehandlingId, visUaktuelle, settVisUaktuelle }) => {
    return (
        <HStack gap="4">
            <BehandlingSelect
                size="small"
                label=""
                className="flex-item"
                onChange={(event) => {
                    settValgtBehandlingId(event.target.value);
                }}
                disabled={!behandlinger.length}
            >
                {behandlinger.map((b) => (
                    <option key={b.id} value={b.id}>
                        {behandlingstypeTilTekst[b.type]}{' '}
                        {formaterNullableIsoDatoTid(b.vedtaksdato)}
                    </option>
                ))}
            </BehandlingSelect>

            {valgtFagsak && valgtFagsak.stønadstype !== Stønadstype.SKOLEPENGER && (
                <StyledCheckbox
                    size="small"
                    onChange={() => {
                        settVisUaktuelle((prevState) => !prevState);
                    }}
                    checked={visUaktuelle}
                >
                    Vis uaktuelle perioder
                </StyledCheckbox>
            )}
        </HStack>
    );
};

export default BehandlingVelger;
