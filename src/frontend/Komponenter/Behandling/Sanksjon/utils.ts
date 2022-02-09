export const SANKSJONERE_VEDTAK = 'sanksjonere-vedtak';

export const nåværendeÅrOgMåned = (): string => {
    const dagensDato = new Date();
    const nåværendeÅr = dagensDato.getFullYear().toString();
    const nåværendeMåned = (dagensDato.getMonth() + 1).toString(); // Måned er nullindeksert (JAN = 0)
    return nåværendeMåned.length === 1
        ? `${nåværendeÅr}-0${nåværendeMåned}`
        : `${nåværendeÅr}-${nåværendeMåned}`;
};
