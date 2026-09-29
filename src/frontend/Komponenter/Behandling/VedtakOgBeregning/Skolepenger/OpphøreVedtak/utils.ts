import { ISkoleårsperiodeSkolepenger } from '../../../../../App/typer/vedtak';

export const erSammeSkoleårsperiode = (
    skoleårsperiode: ISkoleårsperiodeSkolepenger,
    annenSkoleårsperiode: ISkoleårsperiodeSkolepenger
): boolean => {
    const utgiftIder = new Set(skoleårsperiode.utgiftsperioder.map((utgift) => utgift.id));
    return annenSkoleårsperiode.utgiftsperioder.some((utgift) => utgiftIder.has(utgift.id));
};
