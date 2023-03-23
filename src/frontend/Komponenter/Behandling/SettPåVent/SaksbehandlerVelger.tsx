import React, { FC } from 'react';
import { Select } from '@navikt/ds-react';
import { useApp } from '../../../App/context/AppContext';
import { IOppgave } from '../../Oppgavebenk/typer/oppgave';

export const SaksbehandlerVelger: FC<{
    oppgave: IOppgave;
    saksbehandler: string | undefined;
    settSaksbehandler: (saksbehandler: string) => void;
}> = ({ oppgave, saksbehandler, settSaksbehandler }) => {
    const { innloggetSaksbehandler } = useApp();

    return (
        <div>
            <Select
                label={'Saksbehandler'}
                size={'small'}
                value={saksbehandler}
                onChange={(e) => {
                    settSaksbehandler(e.target.value);
                }}
            >
                {oppgave.tilordnetRessurs &&
                    innloggetSaksbehandler.navIdent !== oppgave.tilordnetRessurs && (
                        <option value={oppgave.tilordnetRessurs}>{oppgave.tilordnetRessurs}</option>
                    )}
                <option value={innloggetSaksbehandler.navIdent}>
                    {innloggetSaksbehandler.displayName}
                </option>
                <option value={''}>Ingen</option>
            </Select>
        </div>
    );
};
