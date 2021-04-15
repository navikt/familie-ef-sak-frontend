import React from 'react';
import MånedÅrVelger from './MånedÅrVelger';

export enum PeriodeVariant {
    ÅR_FRA = 'årFra',
    ÅR_TIL = 'årTil',
    MÅNED_FRA = 'månedFra',
    MÅNED_TIL = 'månedTil',
}

interface Props {
    datoFraTekst?: string;
    datoTilTekst?: string;
    månedFra?: number;
    årFra?: number;
    månedTil?: number;
    årTil?: number;
    onEndre: (verdi: number, type: PeriodeVariant) => void;
    antallÅrTilbake?: number;
    antallÅrFrem?: number;
    feilmelding?: string;
}

const MånedÅrPeriode: React.FC<Props> = ({
    månedFra,
    månedTil,
    årFra,
    årTil,
    datoFraTekst,
    datoTilTekst,
    onEndre,
    antallÅrTilbake = 10,
    antallÅrFrem = 4,
    feilmelding,
}) => {
    return (
        <>
            <MånedÅrVelger
                måned={månedFra}
                år={årFra}
                label={datoFraTekst}
                settMåned={(verdi) => onEndre(verdi, PeriodeVariant.MÅNED_FRA)}
                settÅr={(verdi) => onEndre(verdi, PeriodeVariant.ÅR_FRA)}
                antallÅrTilbake={antallÅrTilbake}
                antallÅrFrem={antallÅrFrem}
            />
            <MånedÅrVelger
                måned={månedTil}
                år={årTil}
                label={datoTilTekst}
                settMåned={(verdi) => onEndre(verdi, PeriodeVariant.MÅNED_TIL)}
                settÅr={(verdi) => onEndre(verdi, PeriodeVariant.ÅR_TIL)}
                antallÅrTilbake={antallÅrTilbake}
                antallÅrFrem={antallÅrFrem}
                feilmelding={feilmelding}
            />
        </>
    );
};

export default MånedÅrPeriode;
