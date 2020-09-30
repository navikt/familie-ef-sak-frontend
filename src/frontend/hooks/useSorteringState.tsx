import { useState } from 'react';

export type OrNothing<T> = T | undefined | null;

export type Rekkefolge = 'descending' | 'ascending';

export interface SorteringConfig<T> {
    rekkefolge: Rekkefolge;
    sorteringsfelt: keyof T;
}

export function useSorteringState<T>(config: OrNothing<SorteringConfig<T>> = null) {
    const [sortConfig, setSortConfig] = useState<OrNothing<SorteringConfig<T>>>(config);

    const settSortering = (sorteringsfelt: keyof T) => {
        let rekkefolge: Rekkefolge = 'ascending';
        if (
            sortConfig &&
            sortConfig.sorteringsfelt === sorteringsfelt &&
            sortConfig.rekkefolge === 'ascending'
        ) {
            rekkefolge = 'descending';
        }
        setSortConfig({ sorteringsfelt, rekkefolge });
    };

    return { sortConfig, settSortering };
}
