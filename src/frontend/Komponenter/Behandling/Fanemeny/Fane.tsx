import * as React from 'react';
import styled from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';
import { FaneProps, FaneNavn } from './faner';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';
import { ABlue400, ABlue500, AGray100, AGray300, ATextAction } from '@navikt/ds-tokens/dist/tokens';
import { loggNavigereTabEvent } from '../../../App/utils/amplitude/amplitudeLoggEvents';
import { Behandling } from '../../../App/typer/fagsak';
import { Steg } from '../Høyremeny/Steg';
import { useApp } from '../../../App/context/AppContext';
import { useBehandling } from '../../../App/context/BehandlingContext';

const StyledNavLink = styled(NavLink)`
    border-bottom: 5px solid white;
    color: inherit;
    text-align: center;
    text-decoration: none;
    width: 100%;
    padding-top: 1rem;
    padding-bottom: 1rem;

    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    padding-left: 5px;
    padding-right: 5px;

    &:hover {
        border-bottom: 5px solid ${ABlue400};

        .navds-body-short {
            color: ${ATextAction};
        }
    }

    &.active {
        background-color: ${AGray100};
        border-bottom: 5px solid ${ABlue500};
    }
`;

const StyledLenketekst = styled(BodyShortSmall)`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const StyledTekst = styled(BodyShortSmall)`
    border-bottom: 5px solid white;
    color: ${AGray300};
    text-align: center;
    text-decoration: none;
    width: 100%;
    padding-top: 1rem;
    padding-bottom: 1rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;

    padding-left: 5px;
    padding-right: 5px;
`;

interface Props {
    fane: FaneProps;
    behandling: Behandling;
    index: number;
}

export const Fane: React.FC<Props> = ({ fane, behandling, index }) => {
    const { erSaksbehandler } = useApp();
    const { behandlingErRedigerbar } = useBehandling();
    const location = useLocation();

    const fanenavn =
        fane.navn === FaneNavn.IVERKSETTE_KA_VEDTAK || fane.navn === FaneNavn.KORRIGERING_UTEN_BREV
            ? FaneNavn.BREV
            : fane.navn;

    const nåværendeFane = location.pathname.split('/')[3];

    const låsendeSteg = [Steg.VILKÅR, Steg.BEREGNE_YTELSE];

    const fanerSomKanLåses = [
        FaneNavn.SIMULERING,
        FaneNavn.BREV,
        FaneNavn.KORRIGERING_UTEN_BREV,
        FaneNavn.IVERKSETTE_KA_VEDTAK,
    ];

    const fanerSomErLåstForVeilederUnderArbeid = [
        FaneNavn.VEDTAK_OG_BEREGNING,
        FaneNavn.SIMULERING,
        FaneNavn.BREV,
        FaneNavn.KORRIGERING_UTEN_BREV,
        FaneNavn.IVERKSETTE_KA_VEDTAK,
    ];

    const erFaneDeaktivert =
        behandlingErRedigerbar && !erSaksbehandler
            ? fanerSomErLåstForVeilederUnderArbeid.includes(fane.navn as FaneNavn)
            : fanerSomKanLåses.includes(fane.navn as FaneNavn) &&
              låsendeSteg.includes(behandling.steg);

    if (erFaneDeaktivert) {
        return (
            <StyledTekst>
                {index + 1}. {fanenavn}
            </StyledTekst>
        );
    }

    return (
        <StyledNavLink
            key={fane.navn}
            to={`/behandling/${behandling.id}/${fane.href}`}
            onClick={() =>
                loggNavigereTabEvent({
                    side: 'behandling',
                    forrigeFane: nåværendeFane,
                    nesteFane: fane.href,
                    behandlingStatus: behandling.status,
                    behandlingSteg: behandling.steg,
                })
            }
        >
            <StyledLenketekst>
                {index + 1}. {fanenavn}
            </StyledLenketekst>
        </StyledNavLink>
    );
};
