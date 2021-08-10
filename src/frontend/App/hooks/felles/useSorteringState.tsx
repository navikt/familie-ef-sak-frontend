import { useMemo, useState } from 'react';
import { compareAsc, compareDesc, isValid } from 'date-fns';

export type OrNothing<T> = T | undefined | null;

export type Rekkefolge = 'descending' | 'ascending';

export interface SorteringConfig<T> {
    rekkefolge: Rekkefolge;
    sorteringsfelt: keyof T;
}

interface ISortering<T> {
    sortertListe: T[];
    settSortering: (sorteringfelt: keyof T) => void;
    sortConfig: OrNothing<SorteringConfig<T>>;
}

export function useSorteringState<T>(
    liste: T[],
    config: OrNothing<SorteringConfig<T>> = null
): ISortering<T> {
    const [sortConfig, setSortConfig] = useState<OrNothing<SorteringConfig<T>>>(config);

    const sortertListe = useMemo(() => {
        const listeKopi = [...liste];
        if (sortConfig) {
            listeKopi.sort((a, b) => {
                if (a[sortConfig?.sorteringsfelt] === undefined) {
                    return sortConfig?.rekkefolge === 'ascending' ? -1 : 1;
                }
                if (b[sortConfig?.sorteringsfelt] === undefined) {
                    return sortConfig?.rekkefolge === 'ascending' ? 1 : -1;
                }
                if (erEttDatoFelt(a[sortConfig?.sorteringsfelt], b[sortConfig?.sorteringsfelt])) {
                    const dateStringA = (a[sortConfig?.sorteringsfelt] as unknown) as string;
                    const dateStringB = (b[sortConfig?.sorteringsfelt] as unknown) as string;
                    return sortConfig?.rekkefolge === 'ascending'
                        ? compareAsc(new Date(dateStringA), new Date(dateStringB))
                        : compareDesc(new Date(dateStringA), new Date(dateStringB));
                }
                if (a[sortConfig?.sorteringsfelt] < b[sortConfig?.sorteringsfelt]) {
                    return sortConfig?.rekkefolge === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig?.sorteringsfelt] > b[sortConfig?.sorteringsfelt]) {
                    return sortConfig?.rekkefolge === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return listeKopi;
    }, [liste, sortConfig]);

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

    return { sortertListe, settSortering, sortConfig };
}

function erEttDatoFelt<T>(maybeDateA: T[keyof T], maybeDateB: T[keyof T]) {
    if (
        (typeof maybeDateA === 'string' || typeof maybeDateA === 'number') &&
        (typeof maybeDateB === 'string' || typeof maybeDateB === 'number')
    ) {
        return isValid(new Date(maybeDateA)) && isValid(new Date(maybeDateB));
    }
    return false;
}
