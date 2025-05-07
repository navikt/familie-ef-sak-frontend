export const oppgaveRequestKeyPrefix = 'oppgaveFiltreringRequest';
export const dokumentOversiktKeyPrefix = 'dokumentOversiktRequest';

export const oppgaveRequestKey = (innloggetIdent: string) =>
    oppgaveRequestKeyPrefix + innloggetIdent;

export const dokumentOversiktRequestKey = (fagsakPersonId: string) =>
    dokumentOversiktKeyPrefix + fagsakPersonId;

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

export const slettElementFraLocalStorage = (key: string) => {
    try {
        localStorage.removeItem(key);
    } catch {
        // Ingen skade skjedd
    }
};
