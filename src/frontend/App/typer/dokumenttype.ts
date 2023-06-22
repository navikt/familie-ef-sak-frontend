export enum Dokumenttype {
    I = 'I',
    U = 'U',
    N = 'N',
}

export const dokumenttyperTilTekst: Record<Dokumenttype, string> = {
    I: 'Inngående',
    N: 'Notat',
    U: 'Utgående',
};
