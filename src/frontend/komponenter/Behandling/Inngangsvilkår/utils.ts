export const hentBooleanTekst = (value: boolean): string => (value ? 'Ja' : 'Nei');

export const erNavnUtfylt = (navn: string): boolean => {
    return navn !== undefined && navn !== null;
};
