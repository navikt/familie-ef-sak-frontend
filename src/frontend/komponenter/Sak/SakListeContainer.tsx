import * as React from 'react';
import { SakListeProvider } from '../../context/SakListeContext';
import SakListe from './SakListe';
import Oppgavebenk from '../Oppgavebenk/Oppgavebenk';

const SakListeContainer: React.FunctionComponent = () => {
    return (
        <SakListeProvider>
            <SakListe />
            <Oppgavebenk />
        </SakListeProvider>
    );
};

export default SakListeContainer;
