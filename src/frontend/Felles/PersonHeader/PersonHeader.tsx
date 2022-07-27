import React, { FC, useEffect, useState } from 'react';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import VisittKort from '@navikt/familie-visittkort';
import styled from 'styled-components';
import { Element } from 'nav-frontend-typografi';
import PersonStatusVarsel from '../Varsel/PersonStatusVarsel';
import AdressebeskyttelseVarsel from '../Varsel/AdressebeskyttelseVarsel';
import { EtikettFokus, EtikettInfo, EtikettSuksess } from 'nav-frontend-etiketter';
import { Behandling } from '../../App/typer/fagsak';
import navFarger from 'nav-frontend-core';
import { Sticky } from '../Visningskomponenter/Sticky';
import { erEtterDagensDato, nullableDatoTilAlder } from '../../App/utils/dato';
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
import {
    Stønadstype,
    stønadstypeTilTekst,
    stønadstypeTilTekstKort,
} from '../../App/typer/behandlingstema';
import { Behandlingsårsak, behandlingsårsakTilTekst } from '../../App/typer/Behandlingsårsak';
import { OppgaveAlleredePlukket } from './OppgaveAlleredePlukket';

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

export const PersonHeaderWrapper = styled(Sticky)`
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

const PersonHeaderComponent: FC<{
    data: IPersonopplysninger;
    behandling?: Behandling;
    åpenHøyreMeny?: boolean;
}> = ({ data, behandling, åpenHøyreMeny }) => {
    const {
        personIdent,
        kjønn,
        navn,
        folkeregisterpersonstatus,
        adressebeskyttelse,
        egenAnsatt,
        fullmakt,
        vergemål,
        fødselsdato,
    } = data;

    const { axiosRequest, gåTilUrl, erSaksbehandler } = useApp();
    const [fagsakPersonId, settFagsakPersonId] = useState<string>('');
    const [erMigrert, settErMigrert] = useState(false);
    const [feilFagsakHenting, settFeilFagsakHenting] = useState<string>();
    const [visOppgavePlukket, settVisOppgavePlukket] = useState<boolean>(true);

    const utledVisningsnavn = (): string => {
        const alder = nullableDatoTilAlder(fødselsdato);
        return alder ? `${navn.visningsnavn} (${alder})` : navn.visningsnavn;
    };

    const utledOmFagsakErMigrert = (fagsak: {
        fagsakId: string;
        stønadstype: Stønadstype;
        erLøpende: boolean;
        erMigrert: boolean;
    }) => {
        if (behandling) {
            return behandling.fagsakId === fagsak.fagsakId && fagsak.erMigrert;
        }
        return fagsak.stønadstype === Stønadstype.OVERGANGSSTØNAD && fagsak.erMigrert;
    };

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
                        settErMigrert(respons.data.fagsaker.some(utledOmFagsakErMigrert));
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
        <>
            <PersonHeaderWrapper>
                {feilFagsakHenting && (
                    <Alertstripe type="feil">Kunne ikke hente fagsak</Alertstripe>
                )}
                <VisittKort
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
                            <Visningsnavn>{utledVisningsnavn()}</Visningsnavn>
                        </ResponsivLenke>
                    }
                >
                    {folkeregisterpersonstatus && (
                        <ElementWrapper>
                            <PersonStatusVarsel
                                folkeregisterpersonstatus={folkeregisterpersonstatus}
                            />
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
                        {behandling &&
                            behandling.behandlingsårsak === Behandlingsårsak.PAPIRSØKNAD && (
                                <ElementWrapper>
                                    <EtikettFokus mini>
                                        {behandlingsårsakTilTekst[behandling.behandlingsårsak]}
                                    </EtikettFokus>
                                </ElementWrapper>
                            )}
                    </TagsKnyttetTilBehandling>
                </VisittKort>

                {behandling && (
                    <>
                        <AlleStatuser behandling={behandling} />
                        <StatuserLitenSkjerm>
                            <StatusMeny behandling={behandling} />
                        </StatuserLitenSkjerm>
                    </>
                )}
                {erSaksbehandler && behandling && erBehandlingRedigerbar(behandling) && (
                    <StyledHamburgermeny />
                )}
            </PersonHeaderWrapper>
            <OppgaveAlleredePlukket
                visible={visOppgavePlukket}
                settVisible={settVisOppgavePlukket}
                åpenHøyreMeny={åpenHøyreMeny}
            />
        </>
    );
};

export default PersonHeaderComponent;
