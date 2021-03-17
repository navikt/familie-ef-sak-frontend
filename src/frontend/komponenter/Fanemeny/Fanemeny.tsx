import * as React from 'react';
import { FC } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router';
import { IBehandlingParams } from '../../typer/routing';
import { ISide, SideId, sider } from './sider';
import { Normaltekst } from 'nav-frontend-typografi';
import { NavLink } from 'react-router-dom';
import navFarger from 'nav-frontend-core';
import { useBehandling } from '../../context/BehandlingContext';
import { Behandling } from '../../typer/fagsak';
import DataViewer from '../Felleskomponenter/DataViewer/DataViewer';
import { Behandlingstype } from '../../typer/behandlingstype';

const StyledFanemeny = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border-bottom: ${navFarger.navGra40} solid 2px;
`;

const StyledNavLink = styled(NavLink)`
    border-bottom: 5px solid white;
    color: inherit;
    text-align: center;
    text-decoration: none;
    width: 100%;
    padding-top: 1rem;
    padding-bottom: 1rem;

    :hover {
        border-bottom: 5px solid ${navFarger.navBlaLighten20};

        .typo-normal {
            color: ${navFarger.navBla};
        }
    }

    &.aktiv {
        background-color: ${navFarger.navLysGra};
        border-bottom: 5px solid ${navFarger.navBla};

        .typo-normal {
            font-weight: bold;
        }
    }
`;
const Fanemeny: FC = () => {
    const { behandlingId } = useParams<IBehandlingParams>();
    const { behandling } = useBehandling();

    const fanerForBlankettbehandling = (sider: ISide[], behandling: Behandling): ISide[] => {
        if (behandling.type === Behandlingstype.BLANKETT) {
            return sider.filter((side) => side.id !== SideId.BREV);
        }
        return sider.filter((side) => side.id !== SideId.BLANKETT);
    };

    return (
        <DataViewer response={{ behandling }}>
            {({ behandling }) => (
                <>
                    <StyledFanemeny>
                        {fanerForBlankettbehandling(sider, behandling).map((side) => (
                            <StyledNavLink
                                key={side.navn}
                                to={`/behandling/${behandlingId}/${side.href}`}
                                activeClassName="aktiv"
                            >
                                <Normaltekst>{side.navn}</Normaltekst>
                            </StyledNavLink>
                        ))}
                    </StyledFanemeny>
                </>
            )}
        </DataViewer>
    );
};

export default Fanemeny;
