import React from 'react';
import { KopierbartNullableFødselsnummer } from '../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import styled from 'styled-components';
import { Heading } from '@navikt/ds-react';
import { BodyShortSmall } from '../../Felles/Visningskomponenter/Tekster';

interface BrukerinfoProps {
    navn: string;
    personIdent: string;
}

const FlexDiv = styled.div`
    display: flex;
    > :last-child {
        padding-left: 0.25rem;
    }
`;

const Brukerinfo: React.FC<BrukerinfoProps> = ({ navn, personIdent }) => {
    return (
        <>
            <Heading size={'medium'} level={'2'}>
                Navn og fødselsnummer
            </Heading>
            <FlexDiv>
                <BodyShortSmall>{navn} -</BodyShortSmall>
                <KopierbartNullableFødselsnummer fødselsnummer={personIdent} />
            </FlexDiv>
        </>
    );
};

export default Brukerinfo;
