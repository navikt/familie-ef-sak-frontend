import { OrNothing } from '../hooks/felles/useSorteringState';
import { isBefore } from 'date-fns';
import { IOppgaveRequest } from '../komponenter/Oppgavebenk/oppgaverequest';

export const datoFeil = (valgtDatoFra?: string, valgtDatoTil?: string): OrNothing<string> => {
    if (!valgtDatoFra || !valgtDatoTil) {
        return null;
    }
    if (isBefore(new Date(valgtDatoTil), new Date(valgtDatoFra))) {
        return 'Til dato må vare etter til fra dato';
    }
    return null;
};

export const oppdaterFilter = (
    object: IOppgaveRequest,
    key: keyof IOppgaveRequest,
    val?: string | number
): IOppgaveRequest => {
    if (!val || val === '') {
        const { [key]: dummy, ...remainder } = object;
        return remainder;
    }
    return {
        ...object,
        [key]: val,
    };
};
