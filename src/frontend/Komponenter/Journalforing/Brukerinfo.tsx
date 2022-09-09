import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import React from 'react';
import { KopierbartNullableFødselsnummer } from '../../Felles/Fødselsnummer/KopierbartNullableFødselsnummer';
import styled from 'styled-components';

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
            <Systemtittel>Navn og fødselsnummer</Systemtittel>
            <FlexDiv>
                <Normaltekst>{navn} -</Normaltekst>
                <KopierbartNullableFødselsnummer fødselsnummer={personIdent} />
            </FlexDiv>
        </>
    );
};

export default Brukerinfo;
