import * as React from 'react';
import styled from 'styled-components';
import { NavLink, useLocation } from 'react-router-dom';
import { ISide, SideNavn } from './sider';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';
import { ABlue400, ABlue500, AGray100, AGray300, ATextAction } from '@navikt/ds-tokens/dist/tokens';
import { loggNavigereTabEvent } from '../../../App/utils/amplitude/amplitudeLoggEvents';
import { Behandling } from '../../../App/typer/fagsak';

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

        .navds-body-short {
            font-weight: bold;
        }
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
    side: ISide;
    behandling: Behandling;
    index: number;
    deaktivert: boolean;
}

const Fane: React.FC<Props> = ({ side, behandling, index, deaktivert }) => {
    const fanenavn =
        side.navn === SideNavn.IVERKSETTE_KA_VEDTAK || side.navn === SideNavn.KORRIGERING_UTEN_BREV
            ? SideNavn.BREV
            : side.navn;
    const location = useLocation();
    const nåværendeFane = location.pathname.split('/')[3];
    return (
        <>
            {deaktivert && (
                <StyledTekst>
                    {index + 1}. {fanenavn}
                </StyledTekst>
            )}
            {!deaktivert && (
                <StyledNavLink
                    key={side.navn}
                    to={`/behandling/${behandling.id}/${side.href}`}
                    onClick={() =>
                        loggNavigereTabEvent({
                            side: 'behandling',
                            forrigeFane: nåværendeFane,
                            nesteFane: side.href,
                            behandlingStatus: behandling.status,
                            behandlingSteg: behandling.steg,
                        })
                    }
                >
                    <StyledLenketekst>
                        {index + 1}. {fanenavn}
                    </StyledLenketekst>
                </StyledNavLink>
            )}
        </>
    );
};

export default Fane;
