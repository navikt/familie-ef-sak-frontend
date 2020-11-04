import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import React from 'react';

interface BrukerinfoProps {
    personIdent: string;
}

const Brukerinfo: React.FC<BrukerinfoProps> = (props) => {
    return (
        <>
            <Systemtittel>Fødselsnummer</Systemtittel>
            <Normaltekst>{props.personIdent}</Normaltekst>
        </>
    );
};

export default Brukerinfo;
