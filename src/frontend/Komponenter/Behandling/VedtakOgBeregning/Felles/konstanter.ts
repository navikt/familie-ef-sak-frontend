export const VEDTAK_OG_BEREGNING = 'vedtak-og-beregning';

// TODO: Legge til satser for flere år tilbake i tid
// Det første elementet i listen tilsvarer satsen for 1 barn, det andre elementet for 2 barn og det tredje elementet for 3 barn
export const årTilSatsBeløpForBarnetislyn: Record<number, number[]> = {
    2020: [4053, 5289, 5993],
    2021: [4195, 5474, 6203],
    2022: [4250, 5545, 6284],
};
