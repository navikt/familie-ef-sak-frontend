import React, { FC, useEffect, useState } from 'react';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import Visittkort from '@navikt/familie-visittkort';
import styled from 'styled-components';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import PersonStatusVarsel from '../Varsel/PersonStatusVarsel';
import AdressebeskyttelseVarsel from '../Varsel/AdressebeskyttelseVarsel';
import { EtikettFokus } from 'nav-frontend-etiketter';
import { Behandling, behandlingResultatTilTekst } from '../../App/typer/fagsak';
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
import { behandlingStatusTilTekst } from '../../App/typer/behandlingstatus';
import { formaterIsoDatoTid } from '../../App/utils/formatter';
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

interface MenyInnholdProps {
    åpen: boolean;
}

const HamburgerMeny = styled(Hamburger)`
    margin: 1rem 1rem 0 1rem;

    &:hover {
        cursor: pointer;
    }
`;

const MenyWrapper = styled.div``;

const MenyInnhold = styled.div`
    display: ${(props: MenyInnholdProps) => (props.åpen ? 'block' : 'none')};

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

const GråTekst = styled(Normaltekst)`
    color: ${navFarger.navGra60};
`;

const Statuser = styled.div`
    width: 100%;

    margin-left: 1rem;

    display: flex;

    > div {
        margin: 0.8rem;
    }
`;

const Status = styled.div`
    display: flex;
    flex-direction: row;

    flex-gap: 0.5rem;

    > p {
        margin: 0.2rem;
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
                {behandling && false && (
                    <Statuser>
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
                )}
            </Visittkort>
            {behandling && <Behandlingsinfo behandling={behandling} fagsakId={fagsakId} />}
            <MenyWrapper>
                <HamburgerMeny
                    onClick={() => {
                        settÅpenHamburgerMeny(!åpenHamburgerMeny);
                    }}
                />
                <MenyInnhold åpen={åpenHamburgerMeny}>
                    <ul>
                        <li>Sett på vdent</li>
                        <li>Henlegg</li>
                        <li>Sett Verge/Fullmakt mottakere</li>
                    </ul>
                </MenyInnhold>
            </MenyWrapper>
        </VisittkortWrapper>
    );
};

export default VisittkortComponent;
