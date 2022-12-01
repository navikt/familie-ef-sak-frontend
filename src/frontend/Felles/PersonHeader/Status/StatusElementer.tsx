import React from 'react';
import { FC, useState } from 'react';
import { Behandling, behandlingResultatTilTekst } from '../../../App/typer/fagsak';
import { Expand } from '@navikt/ds-icons';
import { BodyShort, Button } from '@navikt/ds-react';
import { behandlingStatusTilTekst } from '../../../App/typer/behandlingstatus';
import { behandlingstypeTilTekst } from '../../../App/typer/behandlingstype';
import { formaterIsoDatoTid } from '../../../App/utils/formatter';
import styled from 'styled-components';
import { stønadstypeTilTekst } from '../../../App/typer/behandlingstema';
import { NavdsSemanticColorTextMuted } from '@navikt/ds-tokens/dist/tokens';

interface StatusMenyInnholdProps {
    åpen: boolean;
}

interface StatusProps {
    kunEttElement?: boolean;
}

export const GråTekst = styled(BodyShort)`
    color: ${NavdsSemanticColorTextMuted};
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
    color: ${NavdsSemanticColorTextMuted};
`;

const VisStønadOgBehandlingstypePåLitenSkjerm = styled.div`
    @media screen and (min-width: 760px) {
        display: none;
    }
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
    margin-right: ${(props) => (props.kunEttElement ? '0' : '1.3rem')};

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
                icon={<Expand />}
            />
            <StatusMenyInnhold åpen={åpenStatusMeny}>
                <ul>
                    <VisStønadOgBehandlingstypePåLitenSkjerm>
                        <li>
                            <Status>
                                <GråTekst>Stønadstype</GråTekst>
                                <BodyShort>{stønadstypeTilTekst[behandling.stønadstype]}</BodyShort>
                            </Status>
                        </li>
                        <li>
                            <Status>
                                <GråTekst>Behandlingstype</GråTekst>
                                <BodyShort>{behandlingstypeTilTekst[behandling.type]}</BodyShort>
                            </Status>
                        </li>
                    </VisStønadOgBehandlingstypePåLitenSkjerm>
                    <li>
                        <Status>
                            <GråTekst>Behandlingsstatus</GråTekst>
                            <BodyShort>{behandlingStatusTilTekst[behandling.status]}</BodyShort>
                        </Status>
                    </li>
                    <li>
                        <Status>
                            <GråTekst>Behandlingsresultat</GråTekst>
                            <BodyShort>{behandlingResultatTilTekst[behandling.resultat]}</BodyShort>
                        </Status>
                    </li>
                    <li>
                        <Status>
                            <GråTekst>Opprettet</GråTekst>
                            <BodyShort>{formaterIsoDatoTid(behandling.opprettet)}</BodyShort>
                        </Status>
                    </li>
                    <li>
                        <Status>
                            <GråTekst>Sist endret</GråTekst>
                            <BodyShort>{formaterIsoDatoTid(behandling.sistEndret)}</BodyShort>
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
                <GråTekst>Behandlingsstatus</GråTekst>
                <BodyShort>{behandlingStatusTilTekst[behandling.status]}</BodyShort>
            </Status>
            <Status>
                <GråTekst>Behandlingsresultat</GråTekst>
                <BodyShort>{behandlingResultatTilTekst[behandling.resultat]}</BodyShort>
            </Status>
            <Status>
                <GråTekst>Opprettet</GråTekst>
                <BodyShort>{formaterIsoDatoTid(behandling.opprettet)}</BodyShort>
            </Status>
            <Status>
                <GråTekst>Sist endret</GråTekst>
                <BodyShort>{formaterIsoDatoTid(behandling.sistEndret)}</BodyShort>
            </Status>
        </Statuser>
    );
};
