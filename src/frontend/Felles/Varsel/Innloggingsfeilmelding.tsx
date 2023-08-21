import React from 'react';
import { ISaksbehandler } from '../../App/typer/saksbehandler';
import { AlertError } from '../Visningskomponenter/Alerts';

interface IProps {
    innloggetSaksbehandler: ISaksbehandler;
}

const Innloggingsfeilmelding: React.FC<IProps> = ({ innloggetSaksbehandler }) => {
    const { groups } = innloggetSaksbehandler;
    if (groups && groups.length > 0) {
        return undefined;
    } else {
        return (
            <AlertError>
                En feil har oppstått ved uthenting av tilgangene dine. Vennligst logg ut og logg inn
                på nytt.
            </AlertError>
        );
    }
};

export default Innloggingsfeilmelding;
