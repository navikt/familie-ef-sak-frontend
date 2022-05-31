import React, { FC, useEffect, useState } from 'react';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import Visittkort from '@navikt/familie-visittkort';
import styled from 'styled-components';
import { Element } from 'nav-frontend-typografi';
import PersonStatusVarsel from '../Varsel/PersonStatusVarsel';
import AdressebeskyttelseVarsel from '../Varsel/AdressebeskyttelseVarsel';
import { EtikettFokus, EtikettInfo, EtikettSuksess } from 'nav-frontend-etiketter';
import { Behandling } from '../../App/typer/fagsak';
import navFarger from 'nav-frontend-core';
import { Sticky } from '../Visningskomponenter/Sticky';
import { erEtterDagensDato } from '../../App/utils/dato';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import { ISøkPerson } from '../../App/typer/personsøk';
import Lenke from 'nav-frontend-lenker';
import { IPersonIdent } from '../../App/typer/felles';
import Alertstripe from 'nav-frontend-alertstriper';
import { Hamburgermeny } from './Hamburgermeny';
import { erBehandlingRedigerbar } from '../../App/typer/behandlingstatus';
import {
    behandlingstypeTilTekst,
    behandlingstypeTilTekstKort,
} from '../../App/typer/behandlingstype';
import { AlleStatuser, StatuserLitenSkjerm, StatusMeny } from './Status/StatusElementer';
import { stønadstypeTilTekst, stønadstypeTilTekstKort } from '../../App/typer/behandlingstema';
import { Behandlingsårsak, behandlingsårsakTilTekst } from '../../App/typer/Behandlingsårsak';

const Visningsnavn = styled(Element)`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const ResponsivLenke = styled(Lenke)`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const TagsKnyttetTilBehandling = styled.div`
    display: flex;
    justify-content: flex-end;
    flex-grow: 1;
`;

const TagsLitenSkjerm = styled.div`
    @media screen and (min-width: 946px) {
        display: none;
    }

    @media screen and (max-width: 760px) {
        display: none;
    }
`;

const TagsStorSkjerm = styled.div`
    @media screen and (max-width: 946px) {
        display: none;
    }
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
    const [fagsakPersonId, settFagsakPersonId] = useState<string>('');
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
                    if (respons.data?.fagsakPersonId) {
                        settFagsakPersonId(respons.data.fagsakPersonId);
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
                    <ResponsivLenke
                        role={'link'}
                        href={`/person/${fagsakPersonId}`}
                        onClick={(e) => {
                            e.preventDefault();
                            gåTilUrl(`/person/${fagsakPersonId}`);
                        }}
                    >
                        <Visningsnavn>{navn.visningsnavn}</Visningsnavn>
                    </ResponsivLenke>
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

                {erMigrert && (
                    <ElementWrapper>
                        <EtikettFokus mini>Migrert</EtikettFokus>
                    </ElementWrapper>
                )}

                <TagsKnyttetTilBehandling>
                    {behandling && (
                        <ElementWrapper>
                            <TagsLitenSkjerm>
                                <EtikettSuksess mini>
                                    {stønadstypeTilTekstKort[behandling.stønadstype]}
                                </EtikettSuksess>
                            </TagsLitenSkjerm>
                            <TagsStorSkjerm>
                                <EtikettSuksess mini>
                                    {stønadstypeTilTekst[behandling.stønadstype]}
                                </EtikettSuksess>
                            </TagsStorSkjerm>
                        </ElementWrapper>
                    )}
                    {behandling && (
                        <ElementWrapper>
                            <TagsLitenSkjerm>
                                <EtikettInfo mini>
                                    {behandlingstypeTilTekstKort[behandling.type]}
                                </EtikettInfo>
                            </TagsLitenSkjerm>
                            <TagsStorSkjerm>
                                <EtikettInfo mini>
                                    {behandlingstypeTilTekst[behandling.type]}
                                </EtikettInfo>
                            </TagsStorSkjerm>
                        </ElementWrapper>
                    )}
                    {behandling && behandling.behandlingsårsak === Behandlingsårsak.PAPIRSØKNAD && (
                        <ElementWrapper>
                            <EtikettFokus mini>
                                {behandlingsårsakTilTekst[behandling.behandlingsårsak]}
                            </EtikettFokus>
                        </ElementWrapper>
                    )}
                </TagsKnyttetTilBehandling>
            </Visittkort>

            {behandling && (
                <>
                    <AlleStatuser behandling={behandling} />
                    <StatuserLitenSkjerm>
                        <StatusMeny behandling={behandling} />
                    </StatuserLitenSkjerm>
                </>
            )}
            {behandling && erBehandlingRedigerbar(behandling) && <StyledHamburgermeny />}
        </VisittkortWrapper>
    );
};

export default VisittkortComponent;
