import * as React from 'react';
import { SakListeProvider } from '../../context/SakListeContext';
import SakListe from './SakListe';

const SakListeContainer: React.FunctionComponent = () => {
    return (
        <SakListeProvider>
            <SakListe />
        </SakListeProvider>
    );
};

export default SakListeContainer;
