const måneder = [
    'januar',
    'februar',
    'mars',
    'april',
    'mai',
    'juni',
    'juli',
    'august',
    'september',
    'oktober',
    'november',
    'desember',
];

export const SANKSJONERE_VEDTAK = 'sanksjonere-vedtak';

export const nesteMånedOgNesteMånedsÅrFormatert = (): string => {
    const [nesteMåned, nesteMånedsÅr] = nesteMånedOgNesteMånedsÅr();

    return nesteMåned.toString().length === 1
        ? `${nesteMånedsÅr.toString()}-0${nesteMåned.toString()}`
        : `${nesteMånedsÅr.toString()}-${nesteMåned.toString()}`;
};

export const nåværendeÅrOgMånedFormatert = (): string => {
    const [nesteMånedIndex, nesteMånedsÅr] = nesteMånedOgNesteMånedsÅr();
    const nesteMåned = måneder[nesteMånedIndex - 1];

    return `${nesteMåned} ${nesteMånedsÅr}`;
};

const nesteMånedOgNesteMånedsÅr = () => {
    const dagensDato = new Date();
    const nåværendeMånedErSisteMåned = dagensDato.getMonth() === 11; // Måned er nullindeksert (JAN = 0, DES = 11)
    const nesteMåned = nåværendeMånedErSisteMåned ? 1 : dagensDato.getMonth() + 2;
    const nesteMånedsÅr = nåværendeMånedErSisteMåned
        ? dagensDato.getFullYear() + 1
        : dagensDato.getFullYear();

    return [nesteMåned, nesteMånedsÅr];
};
