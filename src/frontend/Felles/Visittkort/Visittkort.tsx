import React, { FC, useEffect, useState } from 'react';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import Visittkort from '@navikt/familie-visittkort';
import styled from 'styled-components';
import { Element } from 'nav-frontend-typografi';
import PersonStatusVarsel from '../Varsel/PersonStatusVarsel';
import AdressebeskyttelseVarsel from '../Varsel/AdressebeskyttelseVarsel';
import { EtikettFokus } from 'nav-frontend-etiketter';
import { Behandling } from '../../App/typer/fagsak';
import Behandlingsinfo from './Behandlingsinfo';
import navFarger from 'nav-frontend-core';
import { Sticky } from '../Visningskomponenter/Sticky';
import { erEtterDagensDato } from '../../App/utils/dato';
import { RessursStatus, RessursFeilet, RessursSuksess } from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import { IFagsaksøk } from '../../App/typer/fagsaksøk';
import Lenke from 'nav-frontend-lenker';
import { IPersonIdent } from '../../App/typer/felles';
import Alertstripe from 'nav-frontend-alertstriper';
import { useBehandling } from '../../App/context/BehandlingContext';
import { ToggleName } from '../../App/context/toggles';
import { useToggles } from '../../App/context/TogglesContext';
import { Hamburger } from '@navikt/ds-icons';

export const VisittkortWrapper = styled(Sticky)`
    display: flex;
    border-bottom: 1px solid ${navFarger.navGra80};
    z-index: 22;
    top: 47px;
    .visittkort {
        padding: 0 1.5rem;
        border-bottom: none;
    }
`;

interface HamburgerMenyInnholdProps {
    åpen: boolean;
}

const HamburgerMenyIkon = styled(Hamburger)`
    margin: 1rem 1rem 0 1rem;

    &:hover {
        cursor: pointer;
    }
`;

const HamburgerMenyInnhold = styled.div`
    display: ${(props: HamburgerMenyInnholdProps) => (props.åpen ? 'block' : 'none')};

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
        padding: 0;
    }

    li {
        padding: 0.5rem;

        list-style-type: none;
    }

    li:hover {
        background-color: #0166c5;
        color: white;
        cursor: pointer;
    }
`;

const ElementWrapper = styled.div`
    margin-left: 1rem;
`;

const VisittkortComponent: FC<{ data: IPersonopplysninger; behandling?: Behandling }> = ({
    data,
    behandling,
}) => {
    const {
        personIdent,
        kjønn,
        navn,
        folkeregisterpersonstatus,
        adressebeskyttelse,
        egenAnsatt,
        fullmakt,
        vergemål,
    } = data;

    const { axiosRequest, gåTilUrl } = useApp();
    const [fagsakId, settFagsakId] = useState('');
    const [feilFagsakHenting, settFeilFagsakHenting] = useState<string>();

    const [åpenHamburgerMeny, settÅpenHamburgerMeny] = useState<boolean>(false);

    const { settVisBrevmottakereModal } = useBehandling();

    const { toggles } = useToggles();
    const skalViseSettBrevmottakereKnapp = toggles[ToggleName.visSettBrevmottakereKnapp] || false;

    useEffect(() => {
        const hentFagsak = (personIdent: string): void => {
            if (!personIdent) return;

            axiosRequest<IFagsaksøk, IPersonIdent>({
                method: 'POST',
                url: `/familie-ef-sak/api/sok/`,
                data: { personIdent: personIdent },
            }).then((respons: RessursSuksess<IFagsaksøk> | RessursFeilet) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    if (respons.data?.fagsaker?.length) {
                        settFagsakId(respons.data.fagsaker[0].fagsakId);
                    }
                } else {
                    settFeilFagsakHenting(respons.frontendFeilmelding);
                }
            });
        };

        hentFagsak(personIdent);

        // eslint-disable-next-line
    }, []);
    return (
        <VisittkortWrapper>
            {feilFagsakHenting && <Alertstripe type="feil">Kunne ikke hente fagsak</Alertstripe>}
            <Visittkort
                alder={20}
                ident={personIdent}
                kjønn={kjønn}
                navn={
                    <Lenke
                        role={'link'}
                        href={'#'}
                        onClick={() => {
                            gåTilUrl(`/fagsak/${fagsakId}`);
                        }}
                    >
                        <Element>{navn.visningsnavn}</Element>
                    </Lenke>
                }
            >
                {folkeregisterpersonstatus && (
                    <ElementWrapper>
                        <PersonStatusVarsel folkeregisterpersonstatus={folkeregisterpersonstatus} />
                    </ElementWrapper>
                )}
                {adressebeskyttelse && (
                    <ElementWrapper>
                        <AdressebeskyttelseVarsel adressebeskyttelse={adressebeskyttelse} />
                    </ElementWrapper>
                )}
                {egenAnsatt && (
                    <ElementWrapper>
                        <EtikettFokus mini>Egen ansatt</EtikettFokus>
                    </ElementWrapper>
                )}
                {fullmakt.some((f) => erEtterDagensDato(f.gyldigTilOgMed)) && (
                    <ElementWrapper>
                        <EtikettFokus mini>Fullmakt</EtikettFokus>
                    </ElementWrapper>
                )}
                {vergemål.length > 0 && (
                    <ElementWrapper>
                        <EtikettFokus mini>Verge</EtikettFokus>
                    </ElementWrapper>
                )}
            </Visittkort>
            {behandling && <Behandlingsinfo behandling={behandling} fagsakId={fagsakId} />}
            <div>
                <HamburgerMenyIkon
                    onClick={() => {
                        settÅpenHamburgerMeny(!åpenHamburgerMeny);
                    }}
                />
                <HamburgerMenyInnhold åpen={åpenHamburgerMeny}>
                    <ul>
                        {skalViseSettBrevmottakereKnapp && (
                            <li>
                                <button
                                    onClick={() => {
                                        settVisBrevmottakereModal(true);
                                    }}
                                >
                                    Sett Verge/Fullmakt mottakere
                                </button>
                            </li>
                        )}
                    </ul>
                </HamburgerMenyInnhold>
            </div>
        </VisittkortWrapper>
    );
};

export default VisittkortComponent;
