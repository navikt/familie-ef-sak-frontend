export const SANKSJONERE_VEDTAK = 'sanksjonere-vedtak';

export const nåværendeÅrOgNesteMåned = (): string => {
    const dagensDato = new Date();
    const nåværendeMånedErSisteMåned = dagensDato.getMonth() === 11; // Måned er nullindeksert (JAN = 0, DES = 11)
    const nesteMåned = (nåværendeMånedErSisteMåned ? 1 : dagensDato.getMonth() + 2).toString();
    const nesteMånedsÅr = (
        nåværendeMånedErSisteMåned ? dagensDato.getFullYear() + 1 : dagensDato.getFullYear()
    ).toString();

    return nesteMåned.length === 1
        ? `${nesteMånedsÅr}-0${nesteMåned}`
        : `${nesteMånedsÅr}-${nesteMåned}`;
};
