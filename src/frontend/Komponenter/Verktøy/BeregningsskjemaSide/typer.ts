export enum AvvikEnum {
    INGEN_VERDI = '',
    OPP = '10% avvik opp',
    NED = '10% avvik ned',
    NEI = 'Ikke 10% avvik',
    UNDER_HALV_G = 'Under halv G',
}

export interface Beregning {
    periode: {
        årstall: string;
        måned: string;
    };
    arbeidsgivere: { navn: string; verdi: number }[];
    årslønn: number;
    redusertEtter: number;
    avvik: AvvikEnum;
    beregnetfra: boolean;
}

export interface Periode {
    fra: {
        årstall: string;
        måned: string;
    };
    til: {
        årstall: string;
        måned: string;
    };
}

export type Beregninger = Beregning[];

export const FeilutbetalingType = {
    Ingen: 'Ingen',
    Feilutbetaling: 'Feilutbetaling',
    Etterbetaling: 'Etterbetaling',
} as const;

export type FeilutbetalingType = (typeof FeilutbetalingType)[keyof typeof FeilutbetalingType];
