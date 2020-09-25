import React from 'react';

interface Props {
    oppgaver: any[];
}

const OppgaveTabell: React.FC<Props> = ({ oppgaver }) => {
    console.log('halla', oppgaver);
    return <div />;
};

export default OppgaveTabell;
