import React from 'react';
import MånedÅrVelger from './MånedÅrVelger';
import { Element } from 'nav-frontend-typografi';
import { månederMellom, månedÅrTilDate } from '../../../utils/dato';

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
}

const kalkulerAntallMåneder = (årMånedFra?: string, årMånedTil?: string): number | undefined => {
    if (årMånedFra && årMånedTil) {
        return månederMellom(månedÅrTilDate(årMånedFra), månedÅrTilDate(årMånedTil));
    }
    return undefined;
};

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
    const antallMåneder = kalkulerAntallMåneder(årMånedFraInitiell, årMånedTilInitiell);
    return (
        <div>
            <MånedÅrVelger
                årMånedInitiell={årMånedFraInitiell}
                label={datoFraTekst}
                onEndret={(verdi) => onEndre(verdi, PeriodeVariant.ÅR_MÅNED_FRA)}
                antallÅrTilbake={antallÅrTilbake}
                antallÅrFrem={antallÅrFrem}
                lesevisning={erLesevisning}
            />
            <MånedÅrVelger
                årMånedInitiell={årMånedTilInitiell}
                label={datoTilTekst}
                onEndret={(verdi) => onEndre(verdi, PeriodeVariant.ÅR_MÅNED_TIL)}
                antallÅrTilbake={antallÅrTilbake}
                antallÅrFrem={antallÅrFrem}
                feilmelding={feilmelding}
                lesevisning={erLesevisning}
            />
            <Element>{!!antallMåneder && `${antallMåneder} mnd`}</Element>
        </div>
    );
};

export default MånedÅrPeriode;
