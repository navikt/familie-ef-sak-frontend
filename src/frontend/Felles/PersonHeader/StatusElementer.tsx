import React from 'react';
import { FC, useState } from 'react';
import { Behandling, behandlingResultatTilTekst } from '../../App/typer/fagsak';
import { Expand } from '@navikt/ds-icons';
import { BodyShort, Button } from '@navikt/ds-react';
import { behandlingStatusTilTekst } from '../../App/typer/behandlingstatus';
import { behandlingstypeTilTekst } from '../../App/typer/behandlingstype';
import { formaterIsoDatoTid } from '../../App/utils/formatter';
import styled from 'styled-components';
import { stønadstypeTilTekst } from '../../App/typer/behandlingstema';
import { ATextSubtle } from '@navikt/ds-tokens/dist/tokens';

interface StatusMenyInnholdProps {
    åpen: boolean;
}

export const GråTekst = styled(BodyShort)`
    color: ${ATextSubtle};
`;

const StatusMenyInnhold = styled.div`
    display: ${(props: StatusMenyInnholdProps) => (props.åpen ? 'block' : 'none')};

    position: absolute;

    background-color: white;

    right: 5rem;
    top: 3rem;

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
    color: ${ATextSubtle};
`;

const VisStønadOgBehandlingstypePåLitenSkjerm = styled.div`
    @media screen and (min-width: 760px) {
        display: none;
    }
`;

const Statuser = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;

    white-space: nowrap;

    .stor-skjerm {
        @media screen and (max-width: 1905px) {
            display: none;
        }
    }

    .liten-skjerm {
        @media screen and (min-width: 1905px) {
            display: none;
        }
    }
`;

export const Status = styled.div`
    display: flex;
    width: 100%;

    > p {
        font-size: 14px;
        margin: 0.2rem;
    }
`;

interface Props {
    behandling?: Behandling;
}

const BehandlingStatus: FC<Props> = ({ behandling }) => {
    if (!behandling) {
        return <></>;
    }

    return (
        <>
            <AlleStatuser behandling={behandling} />
            <StatusMeny behandling={behandling} />
        </>
    );
};

const StatusMeny: FC<{ behandling: Behandling }> = ({ behandling }) => {
    const [åpenStatusMeny, settÅpenStatusMeny] = useState<boolean>(false);

    return (
        <Statuser>
            <VisStatuserKnapp
                className="liten-skjerm"
                variant="tertiary"
                onClick={() => {
                    settÅpenStatusMeny(!åpenStatusMeny);
                }}
                icon={<Expand />}
            />
            <StatusMenyInnhold className="liten-skjerm" åpen={åpenStatusMeny}>
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
        </Statuser>
    );
};

const AlleStatuser: FC<{ behandling: Behandling }> = ({ behandling }) => {
    return (
        <Statuser>
            <Status className="stor-skjerm">
                <GråTekst>Behandlingsstatus</GråTekst>
                <BodyShort>{behandlingStatusTilTekst[behandling.status]}</BodyShort>
            </Status>
            <Status className="stor-skjerm">
                <GråTekst>Behandlingsresultat</GråTekst>
                <BodyShort>{behandlingResultatTilTekst[behandling.resultat]}</BodyShort>
            </Status>
            <Status className="stor-skjerm">
                <GråTekst>Opprettet</GråTekst>
                <BodyShort>{formaterIsoDatoTid(behandling.opprettet)}</BodyShort>
            </Status>
            <Status className="stor-skjerm">
                <GråTekst>Sist endret</GråTekst>
                <BodyShort>{formaterIsoDatoTid(behandling.sistEndret)}</BodyShort>
            </Status>
        </Statuser>
    );
};

export default BehandlingStatus;
