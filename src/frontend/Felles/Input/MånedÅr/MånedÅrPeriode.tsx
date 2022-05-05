import React, { useEffect } from 'react';
import MånedÅrVelger from './MånedÅrVelger';

export enum PeriodeVariant {
    ÅR_MÅNED_FRA = 'årMånedFra',
    ÅR_MÅNED_TIL = 'årMånedTil',
}

interface Props {
    datoFraTekst?: string;
    datoTilTekst?: string;
    årMånedFraInitiell?: string;
    årMånedTilInitiell?: string;
    onEndre: (verdi: string | undefined, type: PeriodeVariant) => void;
    antallÅrTilbake?: number;
    antallÅrFrem?: number;
    feilmelding?: string;
    erLesevisning?: boolean;
    index?: number;
}

const MånedÅrPeriode: React.FC<Props> = ({
    årMånedFraInitiell,
    årMånedTilInitiell,
    datoFraTekst,
    datoTilTekst,
    onEndre,
    antallÅrTilbake = 10,
    antallÅrFrem = 4,
    feilmelding,
    erLesevisning,
}) => {
    return (
        <>
            <MånedÅrVelger
                årMånedInitiell={årMånedFraInitiell}
                label={datoFraTekst}
                onEndret={(verdi) => onEndre(verdi, PeriodeVariant.ÅR_MÅNED_FRA)}
                antallÅrTilbake={antallÅrTilbake}
                antallÅrFrem={antallÅrFrem}
                lesevisning={erLesevisning}
                feilmelding={feilmelding}
            />
            <MånedÅrVelger
                årMånedInitiell={årMånedTilInitiell}
                label={datoTilTekst}
                onEndret={(verdi) => onEndre(verdi, PeriodeVariant.ÅR_MÅNED_TIL)}
                antallÅrTilbake={antallÅrTilbake}
                antallÅrFrem={antallÅrFrem}
                lesevisning={erLesevisning}
            />
        </>
    );
};

export default MånedÅrPeriode;
