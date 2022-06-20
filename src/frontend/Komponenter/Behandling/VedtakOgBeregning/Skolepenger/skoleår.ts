import { månedÅrTilDate } from '../../../../App/utils/dato';
import { getMonth, getYear } from 'date-fns';

export type GyldigSkoleår = { gyldig: true; skoleår: number };
type Skoleår = { gyldig: false; årsak: string } | GyldigSkoleår;

const JUNI = 5;
const AUGUST = 7;

const ugyldigSkoleår = (årsak: string): Skoleår => ({ gyldig: false, årsak });

/**
 *  Samme validering som i backend:
 *  https://github.com/navikt/familie-ef-sak/blob/master/src/main/kotlin/no/nav/familie/ef/sak/beregning/skolepenger/BeregningSkolepengerService.kt
 *  2021-01 - 2021-08 true
 *  2021-01 - 2021-09 false
 *  2021-07 - 2022-08 true
 *  2021-07 - 2022-09 false
 */
export const beregnSkoleår = (fom: string, tom: string): Skoleår => {
    const fomDato = månedÅrTilDate(fom);
    const tomDato = månedÅrTilDate(tom);
    if (tomDato < fomDato) return ugyldigSkoleår('Tildato må være etter eller lik fradato');

    const fomMåned = getMonth(fomDato);
    const fomÅr = getYear(fomDato);

    const tomMåned = getMonth(tomDato);
    const tomÅr = getYear(tomDato);

    if (fomMåned > JUNI) {
        if (tomÅr === fomÅr + 1 && tomMåned > AUGUST) {
            return ugyldigSkoleår('Når tildato er i neste år, så må måneden være før september');
        }
        if (tomÅr > fomÅr + 1) {
            return ugyldigSkoleår('Fradato og tildato må være i det samme skoleåret');
        }
        return { gyldig: true, skoleår: fomÅr };
    } else {
        if (tomÅr !== tomÅr) {
            return ugyldigSkoleår('Fradato før juli må ha tildato i det samme året');
        }
        if (tomMåned > AUGUST) {
            return ugyldigSkoleår('Fradato før juli må ha sluttmåned før september');
        }
        return { gyldig: true, skoleår: fomÅr - 1 };
    }
};
