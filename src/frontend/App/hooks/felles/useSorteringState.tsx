import { useMemo, useState } from 'react';
import { compareAsc, compareDesc, isValid } from 'date-fns';

export type OrNothing<T> = T | undefined | null;

export type Rekkefolge = 'descending' | 'ascending';

export interface SorteringConfig<T> {
    direction: Rekkefolge;
    orderBy: keyof T;
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
                if (a[sortConfig?.orderBy] === undefined) {
                    return sortConfig?.direction === 'ascending' ? -1 : 1;
                }
                if (b[sortConfig?.orderBy] === undefined) {
                    return sortConfig?.direction === 'ascending' ? 1 : -1;
                }
                if (erEttDatoFelt(a[sortConfig?.orderBy], b[sortConfig?.orderBy])) {
                    const dateStringA = a[sortConfig?.orderBy] as unknown as string;
                    const dateStringB = b[sortConfig?.orderBy] as unknown as string;
                    return sortConfig?.direction === 'ascending'
                        ? compareAsc(new Date(dateStringA), new Date(dateStringB))
                        : compareDesc(new Date(dateStringA), new Date(dateStringB));
                }
                if (a[sortConfig?.orderBy] < b[sortConfig?.orderBy]) {
                    return sortConfig?.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig?.orderBy] > b[sortConfig?.orderBy]) {
                    return sortConfig?.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return listeKopi;
    }, [liste, sortConfig]);

    const settSortering = (orderBy: keyof T) => {
        let direction: Rekkefolge = 'ascending';
        if (sortConfig && sortConfig.orderBy === orderBy && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ orderBy, direction });
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
