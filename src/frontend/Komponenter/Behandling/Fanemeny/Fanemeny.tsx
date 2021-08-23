import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLocation, useParams, useHistory } from 'react-router';
import { IBehandlingParams } from '../../../App/typer/routing';
import { filtrerSiderEtterBehandlingstype, ISide, SideNavn, sider } from './sider';
import { Normaltekst } from 'nav-frontend-typografi';
import { NavLink } from 'react-router-dom';
import { useBehandling } from '../../../App/context/BehandlingContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Sticky } from '../../../Felles/Visningskomponenter/Sticky';
import navFarger from 'nav-frontend-core';
import { Knapp } from 'nav-frontend-knapper';
import UIModalWrapper from '../../../Felles/Modal/UIModalWrapper';

const StickyMedBoxShadow = styled(Sticky)`
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
`;

const StyledFanemeny = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    border-bottom: ${navFarger.navGra40} solid 2px;
    background-color: ${navFarger.white};
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

const erPåInngangsvilkårAktivitetEllerVedtakFane = (side: ISide) =>
    side.navn === SideNavn.INNGANGSVILKÅR ||
    side.navn === SideNavn.AKTIVITET ||
    side.navn === SideNavn.VEDTAK_OG_BEREGNING;

const hentAktivSide = (path: string) => sider.find((side) => side.href === path);

const Fanemeny: FC = () => {
    const { behandlingId } = useParams<IBehandlingParams>();
    const { behandling, ulagretData, settAntallIRedigeringsmodus } = useBehandling();
    const location = useLocation();
    const history = useHistory();
    const path = location.pathname.split('/')[3];
    const initSide = hentAktivSide(path);

    const [aktivSide, settAktivSide] = useState<ISide | undefined>(initSide);
    const [valgtSide, settValgtSide] = useState<ISide | undefined>(undefined);
    const [visModal, settVisModal] = useState(false);

    useEffect(() => {
        const hentetSide = hentAktivSide(path);
        aktivSide &&
            path !== aktivSide?.href &&
            hentetSide !== undefined &&
            settAktivSide(hentetSide);
    }, [location.pathname, aktivSide, path]);

    return (
        <DataViewer response={{ behandling }}>
            {({ behandling }) => (
                <>
                    <StickyMedBoxShadow>
                        <StyledFanemeny>
                            {filtrerSiderEtterBehandlingstype(sider, behandling).map((side) => (
                                <>
                                    <StyledNavLink
                                        key={side.navn}
                                        to={`/behandling/${behandlingId}/${side.href}`}
                                        activeClassName="aktiv"
                                        onClick={(e) => {
                                            if (
                                                ulagretData &&
                                                aktivSide &&
                                                aktivSide.navn !== side.navn &&
                                                erPåInngangsvilkårAktivitetEllerVedtakFane(
                                                    aktivSide
                                                )
                                            ) {
                                                e.preventDefault();
                                                settValgtSide(side);
                                                settVisModal(true);
                                            }
                                        }}
                                    >
                                        <Normaltekst>{side.navn}</Normaltekst>
                                    </StyledNavLink>
                                    <UIModalWrapper
                                        modal={{
                                            tittel: 'Du har ikke lagret dine siste endringer og vil miste disse om du forlater siden.',
                                            lukkKnapp: false,
                                            visModal: visModal,
                                            onClose: () => settVisModal(false),
                                        }}
                                    >
                                        <Knapp
                                            key={'Forlat siden'}
                                            type={'standard'}
                                            onClick={() => {
                                                settAktivSide(side);

                                                if (valgtSide && aktivSide) {
                                                    settAntallIRedigeringsmodus(0);
                                                    const valgtSidePath = location.pathname.replace(
                                                        aktivSide.href,
                                                        valgtSide.href
                                                    );
                                                    history.push(valgtSidePath);
                                                }
                                                settVisModal(false);
                                            }}
                                        >
                                            Forlat siden
                                        </Knapp>
                                        <Knapp
                                            key={'Gå tilbake'}
                                            type={'flat'}
                                            onClick={() => {
                                                settVisModal(false);
                                            }}
                                        >
                                            Gå tilbake for å lagre
                                        </Knapp>
                                    </UIModalWrapper>
                                </>
                            ))}
                        </StyledFanemeny>
                    </StickyMedBoxShadow>
                </>
            )}
        </DataViewer>
    );
};

export default Fanemeny;
