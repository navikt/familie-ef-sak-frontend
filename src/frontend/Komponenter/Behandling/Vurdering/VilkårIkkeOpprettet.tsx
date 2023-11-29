import { AlertWarning } from '../../../Felles/Visningskomponenter/Alerts';
import React from 'react';

const VilkårIkkeOpprettetAlert = () => {
    return (
        <AlertWarning>
            Vilkår er ikke opprettet for denne behandlingen ennå. Disse blir opprettet når ansvarlig
            saksbehandler åpner behandlingen
        </AlertWarning>
    );
};

export default VilkårIkkeOpprettetAlert;
