import React, { FC, useEffect, useState } from 'react';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import Visittkort from '@navikt/familie-visittkort';
import styled from 'styled-components';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import PersonStatusVarsel from '../Varsel/PersonStatusVarsel';
import AdressebeskyttelseVarsel from '../Varsel/AdressebeskyttelseVarsel';
import { EtikettFokus } from 'nav-frontend-etiketter';
import { Behandling, behandlingResultatTilTekst } from '../../App/typer/fagsak';
import navFarger from 'nav-frontend-core';
import { Sticky } from '../Visningskomponenter/Sticky';
import { erEtterDagensDato } from '../../App/utils/dato';
import { RessursStatus, RessursFeilet, RessursSuksess } from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import { IFagsaksøk } from '../../App/typer/fagsaksøk';
import Lenke from 'nav-frontend-lenker';
import { IPersonIdent } from '../../App/typer/felles';
import { behandlingStatusTilTekst } from '../../App/typer/behandlingstatus';
import Alertstripe from 'nav-frontend-alertstriper';
import { formaterIsoDatoTid } from '../../App/utils/formatter';
import { Hamburgermeny } from './Hamburgermeny';
import { erBehandlingRedigerbar } from '../../App/typer/behandlingstatus';
import { behandlingstypeTilTekst } from '../../App/typer/behandlingstype';

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

interface StatusMenyInnholdProps {
    åpen: boolean;
}

const StatusMeny = () => {
    const [åpenStatusMeny, settÅpenStatusMeny] = useState<boolean>(false);

    return (
        <div>
            <button
                onClick={() => {
                    settÅpenStatusMeny(!åpenStatusMeny);
                }}
            >
                Sepp
            </button>
            <StatusMenyInnhold åpen={åpenStatusMeny}>
                <ul>
                    <li>Test</li>

                    <li>Test 2</li>
                </ul>
            </StatusMenyInnhold>
        </div>
    );
};

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

const StyledHamburgermeny = styled(Hamburgermeny)`
    margin-left: auto;
    display: block;
    position: sticky;

    z-index: 9999;
`;

const ElementWrapper = styled.div`
    margin-left: 1rem;
`;

const GråTekst = styled(Normaltekst)`
    color: ${navFarger.navGra60};
`;

const Statuser = styled.div`
    margin-left: 1rem;
    display: flex;
    align-items: center;

    white-space: nowrap;

    @media screen and (max-width: 1500px) {
        display: none;
    }
`;

const StatuserLitenSkjerm = styled.div`
    margin-left: 1rem;
    display: flex;
    align-items: center;

    color: red;

    white-space: nowrap;

    @media screen and (min-width: 1500px) {
        display: none;
    }
`;

const Status = styled.div`
    display: flex;
    width: 100%;
    margin-right: 0.5rem;

    flex-gap: 0.5rem;
    > p {
        margin: 0.2rem;
    }
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
            {behandling && (
                <>
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
                            <Normaltekst>
                                {behandlingResultatTilTekst[behandling.resultat]}
                            </Normaltekst>
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
                    <StatuserLitenSkjerm>
                        <Status>
                            <GråTekst>Behandlingstype</GråTekst>
                            <Normaltekst>{behandlingstypeTilTekst[behandling.type]}</Normaltekst>
                        </Status>
                        <button>Sepp</button>
                        <StatusMeny />
                    </StatuserLitenSkjerm>
                </>
            )}
            {behandling && erBehandlingRedigerbar(behandling) && (
                <StyledHamburgermeny behandling={behandling} />
            )}
        </VisittkortWrapper>
    );
};

export default VisittkortComponent;
