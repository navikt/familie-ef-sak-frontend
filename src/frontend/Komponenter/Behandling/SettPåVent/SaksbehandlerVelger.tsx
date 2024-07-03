import React, { FC } from 'react';
import { useApp } from '../../../App/context/AppContext';
import { IOppgave } from '../../Oppgavebenk/typer/oppgave';
import { FamilieSelect } from '../../../Felles/Input/FamilieSelect';

export const SaksbehandlerVelger: FC<{
    oppgave: IOppgave;
    saksbehandler: string | undefined;
    settSaksbehandler: (saksbehandler: string) => void;
    erLesevisning: boolean;
}> = ({ oppgave, saksbehandler, settSaksbehandler, erLesevisning }) => {
    const { innloggetSaksbehandler } = useApp();

    return (
        <div>
            <FamilieSelect
                label={'Saksbehandler'}
                size={'small'}
                value={saksbehandler}
                onChange={(e) => {
                    settSaksbehandler(e.target.value);
                }}
                erLesevisning={erLesevisning}
                lesevisningVerdi={saksbehandler || 'Ingen'}
            >
                {oppgave.tilordnetRessurs &&
                    innloggetSaksbehandler.navIdent !== oppgave.tilordnetRessurs && (
                        <option value={oppgave.tilordnetRessurs}>{oppgave.tilordnetRessurs}</option>
                    )}
                <option value={innloggetSaksbehandler.navIdent}>
                    {innloggetSaksbehandler.displayName}
                </option>
                <option value={''}>Ingen</option>
            </FamilieSelect>
        </div>
    );
};
