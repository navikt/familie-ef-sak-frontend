import { expect, test } from 'vitest';
import {
    finnTiProsentAvvik,
    rundTilNærmesteTusen,
    oppdaterBeregnetfra,
    summerÅrslønn,
} from './utils';
import { Beregning, TiProsentAvvik } from './typer';

const beregning: Beregning[] = [
    {
        arbeidsgivere: [
            { navn: 'Arbeidsgiver 1', verdi: 15_000 },
            { navn: 'Arbeidsgiver 2', verdi: 13_000 },
        ],
        årslønn: 336_000,
        redusertEtter: 200_000,
        periode: { årstall: '2025', måned: '01' },
        avvik: TiProsentAvvik.INGEN_VERDI,
        beregnetfra: false,
    },
    {
        arbeidsgivere: [
            { navn: 'Arbeidsgiver 1', verdi: 30_000 },
            { navn: 'Arbeidsgiver 2', verdi: 8_000 },
        ],
        årslønn: 456_000,
        redusertEtter: 420_000,
        periode: { årstall: '2025', måned: '02' },
        avvik: TiProsentAvvik.INGEN_VERDI,
        beregnetfra: false,
    },
    {
        arbeidsgivere: [
            { navn: 'Arbeidsgiver 1', verdi: 0 },
            { navn: 'Arbeidsgiver 2', verdi: 2_000 },
        ],
        årslønn: 24_000,
        redusertEtter: 200_000,
        periode: { årstall: '2025', måned: '03' },
        avvik: TiProsentAvvik.INGEN_VERDI,
        beregnetfra: false,
    },
    {
        arbeidsgivere: [
            { navn: 'Arbeidsgiver 1', verdi: 10_000 },
            { navn: 'Arbeidsgiver 2', verdi: 2_000 },
        ],
        årslønn: 144_000,
        redusertEtter: 100_000,
        periode: { årstall: '2025', måned: '04' },
        avvik: TiProsentAvvik.INGEN_VERDI,
        beregnetfra: false,
    },
    {
        arbeidsgivere: [
            { navn: 'Arbeidsgiver 1', verdi: 2_000 },
            { navn: 'Arbeidsgiver 2', verdi: 1_000 },
        ],
        årslønn: 36_000,
        redusertEtter: 15_000,
        periode: { årstall: '2025', måned: '05' },
        avvik: TiProsentAvvik.INGEN_VERDI,
        beregnetfra: false,
    },
];

test('skal sjekke om summering av årslønn er korrekt', () => {
    const sumÅrslønnFørsteMåned = summerÅrslønn(beregning[0]);
    expect(sumÅrslønnFørsteMåned).toBe(336_000);

    const sumÅrslønnAndreMåned = summerÅrslønn(beregning[1]);
    expect(sumÅrslønnAndreMåned).toBe(456_000);

    const sumÅrslønnTredjeMåned = summerÅrslønn(beregning[2]);
    expect(sumÅrslønnTredjeMåned).toBe(24_000);

    const sumÅrslønnFjerdeMåned = summerÅrslønn(beregning[3]);
    expect(sumÅrslønnFjerdeMåned).toBe(144_000);

    const sumÅrslønnFemteMåned = summerÅrslønn(beregning[4]);
    expect(sumÅrslønnFemteMåned).toBe(36_000);
});

test('skal sjekke om forventet enum for avvik er riktig', () => {
    const avvik = finnTiProsentAvvik(beregning[0]);
    expect(avvik).toBe(TiProsentAvvik.OPP);

    const avvik2 = finnTiProsentAvvik(beregning[1]);
    expect(avvik2).toBe(TiProsentAvvik.NEI);

    const avvik3 = finnTiProsentAvvik(beregning[2]);
    expect(avvik3).toBe(TiProsentAvvik.NED);

    const avvik4 = finnTiProsentAvvik(beregning[3]);
    expect(avvik4).toBe(TiProsentAvvik.OPP);

    const avvik5 = finnTiProsentAvvik(beregning[4]);
    expect(avvik5).toBe(TiProsentAvvik.UNDER_HALV_G);
});

test('skal sjekke om avrunding til nærmeste tusen blir som forventet', () => {
    expect(rundTilNærmesteTusen(123_123)).toBe(123_000);
    expect(rundTilNærmesteTusen(567_891)).toBe(568_000);
    expect(rundTilNærmesteTusen(1_500)).toBe(2_000);
});

test('skal sette korrekt automatisk beregnet fra', () => {
    const beregninger = [...beregning];
    const oppdaterteBeregninger = beregninger.map((beregning) => {
        beregning.avvik = finnTiProsentAvvik(beregning);
        return beregning;
    });

    const oppdatertBeregnetfra = oppdaterBeregnetfra(oppdaterteBeregninger);
    const beregningBeregnetFra = oppdatertBeregnetfra.find(
        (beregning) => beregning.beregnetfra === true
    );
    const beregningBeregnetFraIndex = oppdatertBeregnetfra.findIndex(
        (beregning) => beregning.beregnetfra === true
    );

    expect(oppdatertBeregnetfra).toBeDefined();
    expect(oppdatertBeregnetfra[0].beregnetfra).toBe(false);
    expect(beregningBeregnetFraIndex).toBe(1);
    expect(beregningBeregnetFra?.beregnetfra).toBe(true);
    expect(oppdatertBeregnetfra[2].beregnetfra).toBe(false);
    expect(oppdatertBeregnetfra[3].beregnetfra).toBe(false);
    expect(oppdatertBeregnetfra[4].beregnetfra).toBe(false);
});
