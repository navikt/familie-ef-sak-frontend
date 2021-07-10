export const tekstMapping = (str: string | undefined, record: Record<string, string>): string => {
    if (str) {
        return record[str] || `Finner ikke mapping for '${str}'`;
    } else {
        return 'Ukjent';
    }
};
