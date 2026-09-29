import { describe, expect, test } from 'vitest';
import {
    ESkolepengerStudietype,
    ISkoleårsperiodeSkolepenger,
} from '../../../../../App/typer/vedtak';
import { erSammeSkoleårsperiode } from './utils';

const lagSkoleårsperiode = (
    årMånedTil: string,
    utgiftIder: string[]
): ISkoleårsperiodeSkolepenger => ({
    perioder: [
        {
            studietype: ESkolepengerStudietype.HØGSKOLE_UNIVERSITET,
            årMånedFra: '2026-09',
            årMånedTil,
            studiebelastning: 100,
        },
    ],
    utgiftsperioder: utgiftIder.map((id) => ({
        id,
        årMånedFra: '2026-09',
        stønad: 690,
    })),
    erHentetFraBackend: true,
});

describe('erSammeSkoleårsperiode', () => {
    test('beholder identiteten når til og med-dato endres', () => {
        const forrigeSkoleårsperiode = lagSkoleårsperiode('2027-09', ['utgift-id']);
        const oppdatertSkoleårsperiode = lagSkoleårsperiode('2026-09', ['utgift-id']);

        expect(erSammeSkoleårsperiode(forrigeSkoleårsperiode, oppdatertSkoleårsperiode)).toBe(true);
    });

    test('skiller skoleårsperioder med ulike utgifter', () => {
        const skoleårsperiode = lagSkoleårsperiode('2026-09', ['utgift-id']);
        const annenSkoleårsperiode = lagSkoleårsperiode('2026-09', ['annen-utgift-id']);

        expect(erSammeSkoleårsperiode(skoleårsperiode, annenSkoleårsperiode)).toBe(false);
    });
});
