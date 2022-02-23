import React, { FC, useEffect, useState } from 'react';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import Visittkort from '@navikt/familie-visittkort';
import styled from 'styled-components';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import PersonStatusVarsel from '../Varsel/PersonStatusVarsel';
import AdressebeskyttelseVarsel from '../Varsel/AdressebeskyttelseVarsel';
import { EtikettFokus } from 'nav-frontend-etiketter';
import { Behandling } from '../../App/typer/fagsak';
import navFarger from 'nav-frontend-core';
import { Sticky } from '../Visningskomponenter/Sticky';
import { erEtterDagensDato } from '../../App/utils/dato';
import { RessursStatus, RessursFeilet, RessursSuksess } from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import { ISøkPerson } from '../../App/typer/personsøk';
import Lenke from 'nav-frontend-lenker';
import { IPersonIdent } from '../../App/typer/felles';
import Alertstripe from 'nav-frontend-alertstriper';
import { Hamburgermeny } from './Hamburgermeny';
import { erBehandlingRedigerbar } from '../../App/typer/behandlingstatus';
import { behandlingstypeTilTekst } from '../../App/typer/behandlingstype';
import {
    StatuserLitenSkjerm,
    StatusMeny,
    Status,
    AlleStatuser,
    GråTekst,
} from './Status/StatusElementer';

const Visningsnavn = styled(Element)`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const StyledLenke = styled(Lenke)`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

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

const StyledHamburgermeny = styled(Hamburgermeny)`
    margin-left: auto;
    display: block;
    position: sticky;

    z-index: 9999;
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
    const [erMigrert, settErMigrert] = useState(false);
    const [feilFagsakHenting, settFeilFagsakHenting] = useState<string>();

    useEffect(() => {
        const hentFagsak = (personIdent: string): void => {
            if (!personIdent) return;

            axiosRequest<ISøkPerson, IPersonIdent>({
                method: 'POST',
                url: `/familie-ef-sak/api/sok/`,
                data: { personIdent: personIdent },
            }).then((respons: RessursSuksess<ISøkPerson> | RessursFeilet) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    if (respons.data?.fagsaker?.length) {
                        settFagsakId(respons.data.fagsaker[0].fagsakId);
                        settErMigrert(respons.data.fagsaker[0].erMigrert);
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
                    <StyledLenke
                        role={'link'}
                        href={`/fagsak/${fagsakId}`}
                        onClick={(e) => {
                            e.preventDefault();
                            gåTilUrl(`/fagsak/${fagsakId}`);
                        }}
                    >
                        <Visningsnavn>{navn.visningsnavn}</Visningsnavn>
                    </StyledLenke>
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
                {erMigrert && (
                    <ElementWrapper>
                        <EtikettFokus mini>Migrert</EtikettFokus>
                    </ElementWrapper>
                )}
            </Visittkort>

            {behandling && (
                <>
                    <AlleStatuser behandling={behandling} />
                    <StatuserLitenSkjerm>
                        <Status singel={true}>
                            <GråTekst>Behandlingstype</GråTekst>
                            <Normaltekst>{behandlingstypeTilTekst[behandling.type]}</Normaltekst>
                        </Status>
                        <StatusMeny behandling={behandling} />
                    </StatuserLitenSkjerm>
                </>
            )}
            {behandling && erBehandlingRedigerbar(behandling) && <StyledHamburgermeny />}
        </VisittkortWrapper>
    );
};

export default VisittkortComponent;
