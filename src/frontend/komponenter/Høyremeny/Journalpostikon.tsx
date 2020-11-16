import * as React from 'react';
import { Journalposttype } from '../../typer/journalforing';
import PilVenstre from '../../ikoner/PilVenstre';
import PilNed from '../../ikoner/PilNed';
import PilHøyre from '../../ikoner/PilHøyre';

interface JournalpostikonProps {
    journalposttype: Journalposttype;
}

const Journalpostikon: React.FC<JournalpostikonProps> = ({ journalposttype }) => {
    switch (journalposttype) {
        case 'I':
            return <PilVenstre heigth={16} width={16} />;
        case 'N':
            return <PilNed heigth={16} width={16} />;
        case 'U':
            return <PilHøyre heigth={16} width={16} />;
    }
};

export default Journalpostikon;
