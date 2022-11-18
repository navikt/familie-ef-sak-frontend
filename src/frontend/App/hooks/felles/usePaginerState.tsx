import { useMemo, useState } from 'react';

interface IPaginering<T> {
    valgtSide: number;
    settValgtSide: (valgtSide: number) => void;
    slicedListe: T[];
    antallSider: number;
}

export function usePagineringState<T>(liste: T[], side = 1, sideStorrelse: number): IPaginering<T> {
    const [valgtSide, settValgtSide] = useState<number>(side);
    const antallSider = Math.ceil(liste.length / sideStorrelse);

    //MAYBE OVERKILL MED USEMEMO HER
    const slicedListe = useMemo(() => {
        const listeKopi = [...liste];
        return listeKopi.slice((valgtSide - 1) * sideStorrelse, valgtSide * sideStorrelse);
    }, [liste, sideStorrelse, valgtSide]);
    return { valgtSide, settValgtSide, slicedListe, antallSider };
}
