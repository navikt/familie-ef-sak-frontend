import React, { FC } from 'react';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import styled from 'styled-components';
import { Behandling, Fagsak, FagsakPerson } from '../../App/typer/fagsak';
import { nullableDatoTilAlder } from '../../App/utils/dato';
import { useApp } from '../../App/context/AppContext';
import { AksjonsknapperPersonHeader } from './AksjonsknapperPersonHeader';
import { ABorderStrong } from '@navikt/ds-tokens/dist/tokens';
import Visittkort from './Visittkort';
import PersonTags from './PersonTags';
import BehandlingTags from './BehandlingTags';
import { HStack } from '@navikt/ds-react';

const FlexContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 1rem;
`;

type PersonOversiktProps = {
    personopplysninger: IPersonopplysninger;
    fagsakPerson: FagsakPerson;
};

type BehandlingProps = {
    personopplysninger: IPersonopplysninger;
    behandling: Behandling;
    fagsak: Fagsak;
};

type Props = PersonOversiktProps | BehandlingProps;

const isBehandlingProps = (props: Props): props is BehandlingProps =>
    (props as BehandlingProps).behandling !== undefined;

export const PersonHeader: FC<Props> = (props) => {
    const { erSaksbehandler } = useApp();

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
    } = props.personopplysninger;
    const alder = nullableDatoTilAlder(fødselsdato);
    const visningsnavn = alder ? `${navn.visningsnavn} (${alder})` : navn.visningsnavn;

    const harBehandling = isBehandlingProps(props);
    const erFagsakMigrert = harBehandling
        ? props.fagsak.erMigrert
        : (props.fagsakPerson.overgangsstønad?.erMigrert ?? false);
    const fagsakPersonId = harBehandling ? props.fagsak.fagsakPersonId : props.fagsakPerson.id;

    return (
        <div
            style={{
                padding: '0 1rem 0 1rem',
                borderBottom: `1px solid ${ABorderStrong}`,
            }}
        >
            <HStack justify={'space-between'}>
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
                        migrert={erFagsakMigrert}
                        vergemål={vergemål}
                    />
                </FlexContainer>

                {harBehandling && (
                    <FlexContainer>
                        <BehandlingTags behandling={props.behandling} />
                        <AksjonsknapperPersonHeader
                            behandling={props.behandling}
                            erSaksbehandler={erSaksbehandler}
                        />
                    </FlexContainer>
                )}
            </HStack>
        </div>
    );
};
