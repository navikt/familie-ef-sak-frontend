import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Behandling, behandlingResultatTilTekst } from '../../App/typer/fagsak';
import { Menyknapp } from 'nav-frontend-ikonknapper';
import Popover, { PopoverOrientering } from 'nav-frontend-popover';
import { behandlingstypeTilTekst } from '../../App/typer/behandlingstype';
import { stegTypeTilTekst } from '../../Komponenter/Behandling/Høyremeny/Steg';
import { formaterIsoDatoTid } from '../../App/utils/formatter';
import { behandlingStatusTilTekst } from '../../App/typer/behandlingstatus';
import { Normaltekst } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';

const BehandlingsinfoWrapper = styled.div`
    margin: auto;
    padding-right: 0.25rem;
`;

const PopoverInnehold = styled.div`
    padding: 1rem;
`;

const PopoverTabell = styled.div`
    display: grid;
    grid-template-columns: 1.5fr 1fr;
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

const popoverId = 'visBehandlingsinfo-popover';

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
                aria-controls={popoverId}
                aria-haspopup="menu"
            >
                {behandlingstypeTilTekst[behandling.type]}
            </StyledMenyKnapp>
            <Popover
                id={popoverId}
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
                        <Normaltekst>{formaterIsoDatoTid(behandling.opprettet)}</Normaltekst>

                        <GråTekst>Sist endret</GråTekst>
                        <Normaltekst>{formaterIsoDatoTid(behandling.sistEndret)}</Normaltekst>

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
