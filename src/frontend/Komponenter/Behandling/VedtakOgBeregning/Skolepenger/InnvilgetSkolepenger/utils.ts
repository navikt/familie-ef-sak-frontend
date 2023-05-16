import { månedÅrTilDate, sorterDatoDesc, tilForkortetÅr } from '../../../../../App/utils/dato';
import { IPeriodeSkolepenger } from '../../../../../App/typer/vedtak';
import { tomPeriode } from '../typer';

export const utledStartårForSkoleår = (dato: Date) => {
    const erFørAugust = dato.getMonth() < 7;
    const startÅr = parseInt(tilForkortetÅr(dato), 10);

    return erFørAugust ? startÅr - 1 : startÅr;
};

export const utledTittel = (delårsperioder: IPeriodeSkolepenger[]) => {
    if (delårsperioder.length === 1 && delårsperioder.at(0) === tomPeriode) {
        return '';
    }

    const sortertePerioderDesc = [...delårsperioder]
        .map((periode) => månedÅrTilDate(periode.årMånedFra))
        .sort(sorterDatoDesc);

    const startÅr = utledStartårForSkoleår(sortertePerioderDesc[0]);
    const sluttÅr = startÅr + 1;

    return `Skoleår ${startÅr}/${sluttÅr}`;
};
