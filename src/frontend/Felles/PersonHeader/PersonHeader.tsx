import React, { FC, useEffect, useState } from 'react';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import styled from 'styled-components';
import { Behandling, Fagsak, IFagsakPersonMedBehandlinger } from '../../App/typer/fagsak';
import { Sticky } from '../Visningskomponenter/Sticky';
import { nullableDatoTilAlder } from '../../App/utils/dato';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import { AksjonsknapperPersonHeader } from './AksjonsknapperPersonHeader';
import { ABorderStrong } from '@navikt/ds-tokens/dist/tokens';
import Visittkort from './Visittkort';
import PersonTags from './PersonTags';
import BehandlingTags from './BehandlingTags';

export const Container = styled(Sticky)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;

    padding: 0 1rem 0 1rem;

    border-bottom: 1px solid ${ABorderStrong};
    z-index: 23;
    top: 55px;

    .visittkort {
        border-bottom: none;
    }
`;

const FlexContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

interface Props {
    fagsakPersonId: string;
    personopplysninger: IPersonopplysninger;
    behandling?: Behandling;
    fagsak?: Fagsak;
}

export const PersonHeader: FC<Props> = ({
    fagsakPersonId,
    personopplysninger,
    behandling,
    fagsak,
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
    } = personopplysninger;

    const { axiosRequest, erSaksbehandler } = useApp();
    const [erMigrert, settErMigrert] = useState(false);
    const alder = nullableDatoTilAlder(fødselsdato);
    const visningsnavn = alder ? `${navn.visningsnavn} (${alder})` : navn.visningsnavn;

    useEffect(() => {
        if (fagsak) {
            settErMigrert(fagsak.erMigrert);
        } else {
            axiosRequest<IFagsakPersonMedBehandlinger, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/fagsak-person/${fagsakPersonId}/utvidet`,
            }).then((respons: RessursSuksess<IFagsakPersonMedBehandlinger> | RessursFeilet) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    if (respons.data) {
                        settErMigrert(respons.data.overgangsstønad?.erMigrert ?? false);
                    }
                }
            });
        }
    }, [axiosRequest, fagsak, fagsakPersonId]);

    return (
        <Container>
            <FlexContainer>
                <Visittkort
                    fagsakPersonId={fagsakPersonId}
                    kjønn={kjønn}
                    ident={personIdent}
                    visningsnavn={visningsnavn}
                    borderBottom={false}
                />
                <PersonTags
                    adressebeskyttelse={adressebeskyttelse}
                    alder={alder}
                    egenAnsatt={egenAnsatt}
                    fullmakt={fullmakt}
                    folkeregisterPersonStatus={folkeregisterpersonstatus}
                    migrert={erMigrert}
                    vergemål={vergemål}
                />
            </FlexContainer>
            {behandling && (
                <FlexContainer>
                    <BehandlingTags behandling={behandling} />
                    <AksjonsknapperPersonHeader
                        behandling={behandling}
                        erSaksbehandler={erSaksbehandler}
                    />
                </FlexContainer>
            )}
        </Container>
    );
};
