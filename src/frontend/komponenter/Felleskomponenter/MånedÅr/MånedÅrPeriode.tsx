import React from 'react';
import MånedÅrVelger from './MånedÅrVelger';

interface Props {
    datoFraTekst?: string;
    datoTilTekst?: string;
    månedFra?: number;
    årFra?: number;
    månedTil?: number;
    årTil?: number;
    settMånedFra: (månedFra: number) => void;
    settMånedTil: (månedTil: number) => void;
    settÅrFra: (årFra: number) => void;
    settÅrTil: (årTil: number) => void;
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
    settMånedFra,
    settMånedTil,
    settÅrFra,
    settÅrTil,
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
                settMåned={settMånedFra}
                settÅr={settÅrFra}
                antallÅrTilbake={antallÅrTilbake}
                antallÅrFrem={antallÅrFrem}
            />
            <MånedÅrVelger
                måned={månedTil}
                år={årTil}
                label={datoTilTekst}
                settMåned={settMånedTil}
                settÅr={settÅrTil}
                antallÅrTilbake={antallÅrTilbake}
                antallÅrFrem={antallÅrFrem}
                feilmelding={feilmelding}
            />
        </>
    );
};

export default MånedÅrPeriode;
