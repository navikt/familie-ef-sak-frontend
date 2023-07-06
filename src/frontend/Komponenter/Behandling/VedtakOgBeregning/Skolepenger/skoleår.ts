import { månedÅrTilDate } from '../../../../App/utils/dato';
import { getMonth, getYear } from 'date-fns';
import { ESkolepengerStudietype, ISkoleårsperiodeSkolepenger } from '../../../../App/typer/vedtak';

export type GyldigBeregnetSkoleår = { gyldig: true; skoleår: number };
export type UgyldigBeregnetSkoleår = { gyldig: false; årsak: string | undefined };
type BeregnetSkoleår = UgyldigBeregnetSkoleår | GyldigBeregnetSkoleår;

const ugyldigBeregnetSkoleår = (årsak: string): BeregnetSkoleår => ({ gyldig: false, årsak });

const JUNI = 5;
const AUGUST = 7;

export type GyldigValidertSkoleår = { gyldig: true };
export type UgyldigValidertSkoleår = { gyldig: false; årsak: string; index: number };
type ValidertSkoleår = GyldigValidertSkoleår | UgyldigValidertSkoleår;

const ugyldigValidertSkoleår = (årsak: string, index: number): ValidertSkoleår => ({
    gyldig: false,
    årsak: årsak,
    index: index,
});

export const formatterSkoleår = (skoleår: GyldigBeregnetSkoleår) =>
    `${last2Digits(skoleår.skoleår)}/${last2Digits(skoleår.skoleår + 1)}`;
const last2Digits = (n: number) => String(n).slice(-2);

const skolepengerMaksBeløpForHøgskoleUniversitet = new Map(
    Object.entries({ 2019: 65326, 2020: 66604, 2021: 68136, 2022: 69500, 2023: 74366 })
);

const skolepengerMaksBeløpForVideregående = new Map(
    Object.entries({ 2019: 27276, 2020: 27794, 2021: 28433, 2022: 29002, 2023: 31033 })
);

/**
 *  Samme validering som i backend:
 *  https://github.com/navikt/familie-ef-sak/blob/master/src/main/kotlin/no/nav/familie/ef/sak/beregning/skolepenger/BeregningSkolepengerService.kt
 *  2021-01 - 2021-08 true
 *  2021-01 - 2021-09 false
 *  2021-07 - 2022-08 true
 *  2021-07 - 2022-09 false
 */
export const beregnSkoleår = (fom: string, tom: string): BeregnetSkoleår => {
    const fomDato = månedÅrTilDate(fom);
    const tomDato = månedÅrTilDate(tom);
    if (tomDato < fomDato) return ugyldigBeregnetSkoleår('Tildato må være etter eller lik fradato');

    const fomMåned = getMonth(fomDato);
    const fomÅr = getYear(fomDato);

    const tomMåned = getMonth(tomDato);
    const tomÅr = getYear(tomDato);

    if (fomMåned > JUNI) {
        if (tomÅr === fomÅr + 1 && tomMåned > AUGUST) {
            return ugyldigBeregnetSkoleår(
                'Når tildato er i neste år, så må måneden være før september'
            );
        }
        if (tomÅr > fomÅr + 1) {
            return ugyldigBeregnetSkoleår('Fradato og tildato må være i det samme skoleåret');
        }
        return { gyldig: true, skoleår: fomÅr };
    } else {
        if (fomÅr !== tomÅr) {
            return ugyldigBeregnetSkoleår('Fradato før juli må ha tildato i det samme året');
        }
        if (tomMåned > AUGUST) {
            return ugyldigBeregnetSkoleår('Fradato før juli må ha sluttdato før september');
        }
        return { gyldig: true, skoleår: fomÅr - 1 };
    }
};

export const validerSkoleår = (
    skoleårsperioder: ISkoleårsperiodeSkolepenger[]
): ValidertSkoleår => {
    if (skoleårsperioder.length === 0) {
        return ugyldigValidertSkoleår('Mangelfullt antall skoleår', 0);
    }

    const skoleår = skoleårsperioder.map((skoleårsperiode) =>
        mapSkoleårsperiodeTilSkoleår(skoleårsperiode)
    );

    if (inneholderDuplikater(skoleår)) {
        return ugyldigValidertSkoleår(
            'Flere skoleårsperioder kan ikke tilhøre det samme skoleåret',
            skoleårsperioder.length
        );
    }

    return { gyldig: true };
};

const mapSkoleårsperiodeTilSkoleår = (skoleårsperiode: ISkoleårsperiodeSkolepenger) => {
    const fomDato = månedÅrTilDate(skoleårsperiode.perioder[0].årMånedFra);

    const fomMåned = getMonth(fomDato);
    const fomÅr = getYear(fomDato);

    if (fomMåned > JUNI) {
        return fomÅr;
    }

    return fomÅr - 1;
};

export const utledSkoleårOgMaksBeløp = (skoleårsperiode: ISkoleårsperiodeSkolepenger) => {
    const skoleår = mapSkoleårsperiodeTilSkoleår(skoleårsperiode);
    const maksBeløp = utledMaksBeløpForSkoleårsperiode(skoleårsperiode, skoleår);

    return [skoleår, maksBeløp];
};

const utledMaksBeløpForSkoleårsperiode = (
    skoleårsperiode: ISkoleårsperiodeSkolepenger,
    skoleår: number
) => {
    const førsteDelårsperiode = skoleårsperiode.perioder[0];
    const studieType = førsteDelårsperiode.studietype;

    switch (studieType) {
        case ESkolepengerStudietype.HØGSKOLE_UNIVERSITET:
            return skolepengerMaksBeløpForHøgskoleUniversitet.get(skoleår.toString()) || 0;
        case ESkolepengerStudietype.VIDEREGÅENDE:
            return skolepengerMaksBeløpForVideregående.get(skoleår.toString()) || 0;
        default:
            return 0;
    }
};

const inneholderDuplikater = (skoleår: number[]) => new Set(skoleår).size !== skoleår.length;
