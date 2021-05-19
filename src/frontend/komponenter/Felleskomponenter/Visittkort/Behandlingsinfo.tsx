import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Behandling, behandlingResultatTilTekst } from '../../../typer/fagsak';
import { Menyknapp } from 'nav-frontend-ikonknapper';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import { behandlingstypeTilTekst } from '../../../typer/behandlingstype';
import { stegTypeTilTekst } from '../../Høyremeny/Steg';
import { formaterIsoDato } from '../../../utils/formatter';
import { behandlingStatusTilTekst } from '../../../typer/behandlingstatus';
import { Normaltekst } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';

const BehandlingsinfoWrapper = styled.div`
    display: flex;
    align-items: center;
    padding-right: 0.25rem;
`;

const PopoverInnehold = styled.div`
    padding: 1rem;
`;

const PopoverTabell = styled.div`
    display: grid;
    grid-template-columns: 2fr 1fr;
    margin-bottom: 0.75rem;
    > * {
        margin: 0.25rem 0;
    }
`;

const GråTekst = styled(Normaltekst)`
    color: ${navFarger.navGra60};
`;

const StyledMenyKnapp = styled(Menyknapp)`
    text-transform: none;
`;

const Behandlingsinfo: FC<{ behandling: Behandling }> = ({ behandling }) => {
    const [anker, settAnker] = useState<HTMLButtonElement>();

    const togglePopover = (nyAnker: HTMLButtonElement | undefined) => {
        settAnker(anker ? undefined : nyAnker);
    };

    return (
        <BehandlingsinfoWrapper>
            <StyledMenyKnapp
                id="visBehandlingsinfo"
                onClick={(e) => togglePopover(e.currentTarget)}
                aria-expanded={anker !== undefined}
                aria-controls="visBehandlingsinfo-popover"
                aria-haspopup="menu"
                style={{
                    background: 'none',
                    color: navFarger.navMorkGra,
                    border: `1px solid ${navFarger.navGra60}`,
                    boxShadow: 'none',
                }}
            >
                {behandlingstypeTilTekst[behandling.type]}
            </StyledMenyKnapp>
            <Popover
                id="visBehandlingsinfo-popover"
                ankerEl={anker}
                onRequestClose={() => settAnker(undefined)}
                orientering={PopoverOrientering.Under}
                autoFokus={false}
                tabIndex={-1}
                utenPil
            >
                <PopoverInnehold>
                    <PopoverTabell>
                        <GråTekst>Behandlingsstatus</GråTekst>
                        <Normaltekst>{behandlingStatusTilTekst[behandling.status]}</Normaltekst>

                        <GråTekst>Behandlingsresultat</GråTekst>
                        <Normaltekst>{behandlingResultatTilTekst[behandling.resultat]}</Normaltekst>

                        <GråTekst>Opprettet</GråTekst>
                        <Normaltekst>{formaterIsoDato(behandling.opprettet)}</Normaltekst>

                        <GråTekst>Sist endret</GråTekst>
                        <Normaltekst>{formaterIsoDato(behandling.sistEndret)}</Normaltekst>

                        <GråTekst>Steg</GråTekst>
                        <Normaltekst>{stegTypeTilTekst[behandling.steg]}</Normaltekst>
                    </PopoverTabell>
                    <GråTekst>Id: {behandling.id}</GråTekst>
                </PopoverInnehold>
            </Popover>
        </BehandlingsinfoWrapper>
    );
};

export default Behandlingsinfo;
