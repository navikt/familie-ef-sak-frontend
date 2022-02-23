import React from 'react';
import { FC, useState } from 'react';
import { Behandling, behandlingResultatTilTekst } from '../../../App/typer/fagsak';
import { Expand } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import navFarger from 'nav-frontend-core';
import { behandlingStatusTilTekst } from '../../../App/typer/behandlingstatus';
import { behandlingstypeTilTekst } from '../../../App/typer/behandlingstype';
import { formaterIsoDatoTid } from '../../../App/utils/formatter';
import { Normaltekst } from 'nav-frontend-typografi';
import styled from 'styled-components';

interface StatusMenyInnholdProps {
    åpen: boolean;
}

interface StatusProps {
    singel?: boolean;
}

export const GråTekst = styled(Normaltekst)`
    color: ${navFarger.navGra60};
`;

const StatusMenyInnhold = styled.div`
    display: ${(props: StatusMenyInnholdProps) => (props.åpen ? 'block' : 'none')};

    position: absolute;

    background-color: white;

    right: 1rem;

    border: 1px solid grey;

    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);
    -webkit-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);
    -moz-box-shadow: 5px 5px 5px rgba(0, 0, 0, 0.4);

    ul,
    li {
        margin: 0;
    }

    ul {
        padding: 0.5rem;
    }

    li {
        padding: 0;
        list-style-type: none;
    }
`;

const VisStatuserKnapp = styled(Button)`
    color: ${navFarger.navGra60};
`;

export const Statuser = styled.div`
    margin-left: 1rem;
    display: flex;
    align-items: center;

    white-space: nowrap;

    @media screen and (max-width: 1540px) {
        display: none;
    }
`;

export const StatuserLitenSkjerm = styled.div`
    margin-left: 1rem;
    display: flex;
    align-items: center;

    white-space: nowrap;

    @media screen and (min-width: 1540px) {
        display: none;
    }
`;

export const Status = styled.div<StatusProps>`
    display: flex;
    width: 100%;
    margin-right: ${(props) => (props.singel ? '0' : '1.3rem')};

    flex-gap: 0.5rem;
    > p {
        font-size: 14px;
        margin: 0.2rem;
    }
`;

export const StatusMeny: FC<{ behandling: Behandling }> = ({ behandling }) => {
    const [åpenStatusMeny, settÅpenStatusMeny] = useState<boolean>(false);

    return (
        <div>
            <VisStatuserKnapp
                variant="tertiary"
                onClick={() => {
                    settÅpenStatusMeny(!åpenStatusMeny);
                }}
            >
                <Expand />
            </VisStatuserKnapp>
            <StatusMenyInnhold åpen={åpenStatusMeny}>
                <ul>
                    <li>
                        <Status>
                            <GråTekst>Behandlingsstatus</GråTekst>
                            <Normaltekst>{behandlingStatusTilTekst[behandling.status]}</Normaltekst>
                        </Status>
                    </li>
                    <li>
                        <Status>
                            <GråTekst>Behandlingsresultat</GråTekst>
                            <Normaltekst>
                                {behandlingResultatTilTekst[behandling.resultat]}
                            </Normaltekst>
                        </Status>
                    </li>
                    <li>
                        <Status>
                            <GråTekst>Opprettet</GråTekst>
                            <Normaltekst>{formaterIsoDatoTid(behandling.opprettet)}</Normaltekst>
                        </Status>
                    </li>
                    <li>
                        <Status>
                            <GråTekst>Sist endret</GråTekst>
                            <Normaltekst>{formaterIsoDatoTid(behandling.sistEndret)}</Normaltekst>
                        </Status>
                    </li>
                </ul>
            </StatusMenyInnhold>
        </div>
    );
};

export const AlleStatuser: FC<{ behandling: Behandling }> = ({ behandling }) => {
    return (
        <Statuser>
            <Status>
                <GråTekst>Behandlingstype</GråTekst>
                <Normaltekst>{behandlingstypeTilTekst[behandling.type]}</Normaltekst>
            </Status>
            <Status>
                <GråTekst>Behandlingsstatus</GråTekst>
                <Normaltekst>{behandlingStatusTilTekst[behandling.status]}</Normaltekst>
            </Status>
            <Status>
                <GråTekst>Behandlingsresultat</GråTekst>
                <Normaltekst>{behandlingResultatTilTekst[behandling.resultat]}</Normaltekst>
            </Status>
            <Status>
                <GråTekst>Opprettet</GråTekst>
                <Normaltekst>{formaterIsoDatoTid(behandling.opprettet)}</Normaltekst>
            </Status>
            <Status>
                <GråTekst>Sist endret</GråTekst>
                <Normaltekst>{formaterIsoDatoTid(behandling.sistEndret)}</Normaltekst>
            </Status>
        </Statuser>
    );
};
