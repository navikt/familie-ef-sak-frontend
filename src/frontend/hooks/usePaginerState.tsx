import { useMemo, useState } from 'react';

export function usePagineringState<T>(liste: T[], side = 1, sideStorrelse = 15) {
    const [valgtSide, settValgtSide] = useState<number>(side);

    //MAYBE OVERKILL MED USEMEMO HER
    const slicedListe = useMemo(() => {
        const listeKopi = [...liste];
        return listeKopi.slice((valgtSide - 1) * sideStorrelse, valgtSide * sideStorrelse);
    }, [liste, sideStorrelse, valgtSide]);
    return { valgtSide, settValgtSide, slicedListe };
}
