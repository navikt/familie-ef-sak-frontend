import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import React from 'react';
import { BrukerInfo } from '../../typer/journalforing';

interface BrukerinfoProps {
    bruker: BrukerInfo;
}

const Brukerinfo: React.FC<BrukerinfoProps> = (props) => {
    return (
        <>
            <Systemtittel>Bruker</Systemtittel>
            <Normaltekst>{props.bruker.id}</Normaltekst>
        </>
    );
};

export default Brukerinfo;
