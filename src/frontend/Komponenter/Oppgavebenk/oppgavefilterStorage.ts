export const oppgaveRequestKey = 'oppgaveFiltreringRequest';

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
