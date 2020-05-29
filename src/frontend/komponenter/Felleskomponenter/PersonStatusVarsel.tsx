import React from 'react';
import { Folkeregisterpersonstatus } from '../../typer/saksøk';
import { EtikettAdvarsel } from 'nav-frontend-etiketter';

interface IProps {
    folkeregisterpersonstatus: Folkeregisterpersonstatus;
}

const PersonStatusVarsel: React.FC<IProps> = ({ folkeregisterpersonstatus }) => {
    switch (folkeregisterpersonstatus) {
        case Folkeregisterpersonstatus.DOED:
            return <EtikettAdvarsel mini>Død</EtikettAdvarsel>;
        case Folkeregisterpersonstatus.FORSVUNNET:
            return <EtikettAdvarsel mini>Forsvunnet</EtikettAdvarsel>;
        case Folkeregisterpersonstatus.UTFLYTTET:
            return <EtikettAdvarsel mini>Utflyttet</EtikettAdvarsel>;
        default:
            return null;
    }
};

export default PersonStatusVarsel;
