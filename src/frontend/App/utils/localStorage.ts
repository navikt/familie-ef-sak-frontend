export enum LocalStorageKey {
    OPPGAVE_FILTRERING = 'OPPGAVE_FILTRERING',
    OPPGAVE_TILORDNET = 'OPPGAVE_TILORDNET',
}

const keyTiltekst: Record<LocalStorageKey, string> = {
    OPPGAVE_FILTRERING: 'oppgaveFiltreringRequest',
    OPPGAVE_TILORDNET: 'oppgaveTilordnetRequest',
};

export const oppgaveRequestKey = (innloggetIdent: string, key: LocalStorageKey): string => {
    return keyTiltekst[key] + innloggetIdent;
};

export const lagreTilLocalStorage = <T>(key: string, request: T): void => {
    try {
        localStorage.setItem(key, JSON.stringify(request));
    } catch {
        // Ingen skade skjedd
    }
};

export const hentFraLocalStorage = <T>(key: string, fallbackVerdi: T): T => {
    try {
        const request = localStorage.getItem(key);
        return request ? JSON.parse(request) : fallbackVerdi;
    } catch {
        return fallbackVerdi;
    }
};
