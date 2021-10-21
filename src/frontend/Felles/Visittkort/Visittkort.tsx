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
import { EtikettInfo } from 'nav-frontend-etiketter';

export const VisittkortWrapper = styled(Sticky)`
    display: flex;
    border-bottom: 1px solid ${navFarger.navGra80};
    z-index: 22;
    .visittkort {
        padding: 0 1.5rem;
        border-bottom: none;
    }
`;
const ElementWrapper = styled.div`
    margin-left: 1rem;
`;

const StyledEtikettInfo = styled(EtikettInfo)`
    margin-top: 0.5rem;
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
    const [erLøpende, settErLøpende] = useState<boolean>(false);

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
                        settErLøpende(respons.data.fagsaker[0].erLøpende);
                    }
                } else if (
                    respons.status === RessursStatus.FEILET ||
                    respons.status === RessursStatus.FUNKSJONELL_FEIL ||
                    respons.status === RessursStatus.IKKE_TILGANG
                ) {
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
            {erLøpende && (
                <ElementWrapper>
                    <StyledEtikettInfo mini>Løpende</StyledEtikettInfo>
                </ElementWrapper>
            )}
            {behandling && <Behandlingsinfo behandling={behandling} />}
        </VisittkortWrapper>
    );
};

export default VisittkortComponent;
