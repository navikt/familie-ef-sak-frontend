import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import React from 'react';
import { formaterFødselsnummer } from '../../App/utils/formatter';

interface BrukerinfoProps {
    navn: string;
    personIdent: string;
}

const Brukerinfo: React.FC<BrukerinfoProps> = ({ navn, personIdent }) => {
    return (
        <>
            <Systemtittel>Navn og fødselsnummer</Systemtittel>
            <Normaltekst>
                {navn} - {formaterFødselsnummer(personIdent)}
            </Normaltekst>
        </>
    );
};

export default Brukerinfo;
