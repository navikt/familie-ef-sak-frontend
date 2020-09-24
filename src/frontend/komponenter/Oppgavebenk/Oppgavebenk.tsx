import React from 'react';
import OppgaveHeader from './OppgaveHeader';
import OppgaveListe from './OppgaveListe';

const Oppgavebenk: React.FunctionComponent = () => {
    return (
        <div className="oppgavebenk">
            Test
            <OppgaveHeader />
            <OppgaveListe />
        </div>
    );
};

export default Oppgavebenk;
