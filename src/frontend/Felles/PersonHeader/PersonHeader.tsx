import React, { FC, useEffect, useState } from 'react';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import styled from 'styled-components';
import { Behandling } from '../../App/typer/fagsak';
import { Sticky } from '../Visningskomponenter/Sticky';
import { nullableDatoTilAlder } from '../../App/utils/dato';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import { ISøkPerson } from '../../App/typer/personsøk';
import { IPersonIdent } from '../../App/typer/felles';
import { AksjonsknapperPersonHeader } from './AksjonsknapperPersonHeader';
import BehandlingStatus from './StatusElementer';
import { Stønadstype } from '../../App/typer/behandlingstema';
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

    const { axiosRequest, erSaksbehandler } = useApp();
    const [fagsakPersonId, settFagsakPersonId] = useState<string>('');
    const [migrert, settMigrert] = useState(false);
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
                url: `/familie-ef-sak/api/sok`,
                data: { personIdent: personIdent },
            }).then((respons: RessursSuksess<ISøkPerson> | RessursFeilet) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    if (respons.data?.fagsakPersonId) {
                        settFagsakPersonId(respons.data.fagsakPersonId);
                        settMigrert(respons.data.fagsaker.some(utledOmFagsakErMigrert));
                    }
                }
            });
        };

        hentFagsak(personIdent);

        // eslint-disable-next-line
    }, []);

    return (
        <Container>
            <FlexContainer>
                <Visittkort
                    fagsakPersonId={fagsakPersonId}
                    kjønn={kjønn}
                    ident={personIdent}
                    visningsnavn={visningsnavn}
                />
                <PersonTags
                    adressebeskyttelse={adressebeskyttelse}
                    alder={alder}
                    egenAnsatt={egenAnsatt}
                    fullmakt={fullmakt}
                    folkeregisterPersonStatus={folkeregisterpersonstatus}
                    migrert={migrert}
                    vergemål={vergemål}
                />
            </FlexContainer>
            <FlexContainer>
                <BehandlingTags behandling={behandling} />
                <BehandlingStatus behandling={behandling} />
                <AksjonsknapperPersonHeader
                    behandling={behandling}
                    saksbehandler={erSaksbehandler}
                />
            </FlexContainer>
        </Container>
    );
};

export default PersonHeaderComponent;
