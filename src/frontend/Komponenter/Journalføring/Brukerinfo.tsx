import React from 'react';
import { KopierbartNullableFødselsnummer } from '../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import styled from 'styled-components';
import { Heading } from '@navikt/ds-react';
import { BodyShortSmall } from '../../Felles/Visningskomponenter/Tekster';

interface BrukerinfoProps {
    navn: string;
    personIdent: string;
}

const Container = styled.div`
    margin-top: 1rem;
`;

const FlexDiv = styled.div`
    display: flex;
    > :last-child {
        padding-left: 0.25rem;
    }
`;

const Brukerinfo: React.FC<BrukerinfoProps> = ({ navn, personIdent }) => {
    return (
        <Container>
            <Heading size={'small'} level={'2'}>
                Navn og fødselsnummer
            </Heading>
            <FlexDiv>
                <BodyShortSmall>{navn} -</BodyShortSmall>
                <KopierbartNullableFødselsnummer fødselsnummer={personIdent} />
            </FlexDiv>
        </Container>
    );
};

export default Brukerinfo;
