import { Simulering, SimuleringTabellRad } from './SimuleringTyper';
import { gjelderÅr } from '../../../App/utils/dato';
import { formaterIsoMåned } from '../../../App/utils/formatter';

export const mapSimuleringstabellRader = (
    simuleringsresultat: Simulering,
    år: number
): SimuleringTabellRad[] =>
    simuleringsresultat.perioder
        .filter((periode) => {
            return gjelderÅr(periode.fom, år);
        })
        .map((periode) => {
            return {
                måned: formaterIsoMåned(periode.fom),
                nyttBeløp: periode.nyttBeløp,
                tidligereUtbetalt: periode.tidligereUtbetalt,
                resultat: periode.resultat,
                gjelderNestePeriode: periode.fom === simuleringsresultat.fomDatoNestePeriode,
            };
        });
