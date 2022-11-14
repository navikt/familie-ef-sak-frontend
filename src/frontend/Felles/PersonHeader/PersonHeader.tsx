import React, { FC, useEffect, useState } from 'react';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import VisittKort from '@navikt/familie-visittkort';
import styled from 'styled-components';
import { Element } from 'nav-frontend-typografi';
import PersonStatusVarsel from '../Varsel/PersonStatusVarsel';
import AdressebeskyttelseVarsel from '../Varsel/AdressebeskyttelseVarsel';
import { Behandling } from '../../App/typer/fagsak';
import navFarger from 'nav-frontend-core';
import { Sticky } from '../Visningskomponenter/Sticky';
import { erEtterDagensDato, nullableDatoTilAlder } from '../../App/utils/dato';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import { ISøkPerson } from '../../App/typer/personsøk';
import { IPersonIdent } from '../../App/typer/felles';
import { PersonHeaderHamburgermeny } from './PersonHeaderHamburgermeny';
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
import { Link, Tag } from '@navikt/ds-react';
import { AlertError } from '../Visningskomponenter/Alerts';

const Visningsnavn = styled(Element)`
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
`;

const ResponsivLenke = styled(Link)`
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
    z-index: 23;
    top: 55px;

    .visittkort {
        padding: 0 1.5rem;
        border-bottom: none;
    }
`;

const StyledHamburgermeny = styled(PersonHeaderHamburgermeny)`
    margin-left: auto;
    display: block;
    position: sticky;

    z-index: 9999;
`;

const ElementWrapper = styled.div`
    margin-left: 1rem;
`;

const PersonHeaderComponent: FC<{ data: IPersonopplysninger; behandling?: Behandling }> = ({
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
        fødselsdato,
    } = data;

    const { axiosRequest, gåTilUrl, erSaksbehandler } = useApp();
    const [fagsakPersonId, settFagsakPersonId] = useState<string>('');
    const [erMigrert, settErMigrert] = useState(false);
    const [feilFagsakHenting, settFeilFagsakHenting] = useState<string>();
    const alder = nullableDatoTilAlder(fødselsdato);
    const visningsnavn = alder ? `${navn.visningsnavn} (${alder})` : navn.visningsnavn;

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
        <PersonHeaderWrapper>
            {feilFagsakHenting && <AlertError>Kunne ikke hente fagsak</AlertError>}
            <VisittKort
                alder={20}
                ident={personIdent}
                kjønn={kjønn}
                navn={
                    <ResponsivLenke
                        role={'link'}
                        href={`/person/${fagsakPersonId}`}
                        onClick={(e: MouseEvent) => {
                            e.preventDefault();
                            gåTilUrl(`/person/${fagsakPersonId}`);
                        }}
                    >
                        <Visningsnavn>{visningsnavn}</Visningsnavn>
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
                {alder && alder < 18 && (
                    <ElementWrapper>
                        <Tag variant={'warning'} size={'small'}>
                            Under 18 år
                        </Tag>
                    </ElementWrapper>
                )}
                {egenAnsatt && (
                    <ElementWrapper>
                        <Tag variant={'warning'} size={'small'}>
                            Egen ansatt
                        </Tag>
                    </ElementWrapper>
                )}
                {fullmakt.some((f) => erEtterDagensDato(f.gyldigTilOgMed)) && (
                    <ElementWrapper>
                        <Tag variant={'warning'} size={'small'}>
                            Fullmakt
                        </Tag>
                    </ElementWrapper>
                )}

                {vergemål.length > 0 && (
                    <ElementWrapper>
                        <Tag variant={'warning'} size={'small'}>
                            Verge
                        </Tag>
                    </ElementWrapper>
                )}

                {erMigrert && (
                    <ElementWrapper>
                        <Tag variant={'warning'} size={'small'}>
                            Migrert
                        </Tag>
                    </ElementWrapper>
                )}

                <TagsKnyttetTilBehandling>
                    {behandling && (
                        <ElementWrapper>
                            <TagsLitenSkjerm>
                                <Tag variant={'success'} size={'small'}>
                                    {stønadstypeTilTekstKort[behandling.stønadstype]}
                                </Tag>
                            </TagsLitenSkjerm>
                            <TagsStorSkjerm>
                                <Tag variant={'success'} size={'small'}>
                                    {stønadstypeTilTekst[behandling.stønadstype]}
                                </Tag>
                            </TagsStorSkjerm>
                        </ElementWrapper>
                    )}
                    {behandling && (
                        <ElementWrapper>
                            <TagsLitenSkjerm>
                                <Tag variant={'info'} size={'small'}>
                                    {behandlingstypeTilTekstKort[behandling.type]}
                                </Tag>
                            </TagsLitenSkjerm>
                            <TagsStorSkjerm>
                                <Tag variant={'info'} size={'small'}>
                                    {behandlingstypeTilTekst[behandling.type]}
                                </Tag>
                            </TagsStorSkjerm>
                        </ElementWrapper>
                    )}
                    {behandling && behandling.behandlingsårsak === Behandlingsårsak.PAPIRSØKNAD && (
                        <ElementWrapper>
                            <Tag variant={'warning'} size={'small'}>
                                {behandlingsårsakTilTekst[behandling.behandlingsårsak]}
                            </Tag>
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
    );
};

export default PersonHeaderComponent;
