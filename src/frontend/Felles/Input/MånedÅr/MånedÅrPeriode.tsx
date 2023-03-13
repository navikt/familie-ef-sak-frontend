import React from 'react';
import MånedÅrVelger from './MånedÅrVelger';

export enum PeriodeVariant {
    ÅR_MÅNED_FRA = 'årMånedFra',
    ÅR_MÅNED_TIL = 'årMånedTil',
}

interface Props {
    className?: string;
    datoFraTekst?: string;
    datoTilTekst?: string;
    årMånedFraInitiell?: string;
    årMånedTilInitiell?: string;
    onEndre: (verdi: string | undefined, type: PeriodeVariant) => void;
    antallÅrTilbake?: number;
    antallÅrFrem?: number;
    feilmelding?: string;
    erLesevisning?: boolean;
    disabledFra?: boolean;
    disabledTil?: boolean;
    index?: number;
    size?: 'medium' | 'small';
}

const MånedÅrPeriode: React.FC<Props> = ({
    antallÅrFrem = 4,
    antallÅrTilbake = 10,
    className,
    datoFraTekst,
    datoTilTekst,
    disabledFra,
    disabledTil,
    erLesevisning,
    feilmelding,
    onEndre,
    size,
    årMånedFraInitiell,
    årMånedTilInitiell,
}) => {
    return (
        <>
            <MånedÅrVelger
                className={className}
                årMånedInitiell={årMånedFraInitiell}
                label={datoFraTekst}
                onEndret={(verdi) => onEndre(verdi, PeriodeVariant.ÅR_MÅNED_FRA)}
                antallÅrTilbake={antallÅrTilbake}
                antallÅrFrem={antallÅrFrem}
                lesevisning={erLesevisning}
                feilmelding={feilmelding}
                disabled={disabledFra}
                size={size}
            />
            <MånedÅrVelger
                årMånedInitiell={årMånedTilInitiell}
                label={datoTilTekst}
                onEndret={(verdi) => onEndre(verdi, PeriodeVariant.ÅR_MÅNED_TIL)}
                antallÅrTilbake={antallÅrTilbake}
                antallÅrFrem={antallÅrFrem}
                lesevisning={erLesevisning}
                disabled={disabledTil}
                size={size}
            />
        </>
    );
};

export default MånedÅrPeriode;
