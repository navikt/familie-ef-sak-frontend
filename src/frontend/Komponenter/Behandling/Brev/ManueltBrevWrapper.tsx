import React from 'react';
import ManueltBrev from './ManueltBrev';
import { Ressurs } from '../../../App/typer/ressurs';

export interface BrevmenyProps {
    oppdaterBrevRessurs: (brevRessurs: Ressurs<string>) => void;
    behandlingId?: string;
    fagsakId?: string;
}

export const ManueltBrevWrapper: React.FC<BrevmenyProps> = (props) => {
    return (
        <ManueltBrev
            oppdaterBrevressurs={props.oppdaterBrevRessurs}
            behandlingId={props.behandlingId}
            fagsakId={props.fagsakId}
        />
    );
};
