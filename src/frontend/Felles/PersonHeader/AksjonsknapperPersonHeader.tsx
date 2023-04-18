import React from 'react';
import { useBehandling } from '../../App/context/BehandlingContext';
import { Hamburgermeny } from '../Hamburgermeny/Hamburgermeny';
import styled from 'styled-components';
import { Button } from '@navikt/ds-react';
import { Behandling } from '../../App/typer/fagsak';
import { erBehandlingRedigerbar } from '../../App/typer/behandlingstatus';

const StyledHamburgermeny = styled(Hamburgermeny)`
    margin-right: -1rem;
    margin-left: -1rem;
    padding-bottom: 0.4rem;
    @media screen and (min-width: 980px) {
        display: none;
    }
`;

const ButtonSmall = styled(Button)`
    width: max-content;
    block-size: fit-content;

    @media screen and (max-width: 979px) {
        display: none;
    }
`;

interface Props {
    behandling?: Behandling;
    saksbehandler: boolean;
}

export const AksjonsknapperPersonHeader: React.FC<Props> = ({ saksbehandler, behandling }) => {
    const { settVisHenleggModal, settVisSettPåVent } = useBehandling();

    const menyvalg = [
        {
            tekst: 'Henlegg',
            onClick: () => settVisHenleggModal(true),
        },
        {
            tekst: 'Sett på vent',
            onClick: () => settVisSettPåVent(true),
        },
    ];

    if (saksbehandler && behandling && erBehandlingRedigerbar(behandling))
        return (
            <>
                <StyledHamburgermeny items={menyvalg} />
                <ButtonSmall onClick={() => settVisHenleggModal(true)} size="xsmall">
                    Henlegg
                </ButtonSmall>
                <ButtonSmall onClick={() => settVisSettPåVent(true)} size="xsmall">
                    Sett på vent
                </ButtonSmall>
            </>
        );
};
