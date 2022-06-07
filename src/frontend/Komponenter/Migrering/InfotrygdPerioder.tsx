import { InfotrygdPeriode } from '../../App/typer/infotrygd';
import React from 'react';
import { slåSammenOgSorterPerioder } from '../Infotrygd/grupperInfotrygdperiode';
import { Stønadstype } from '../../App/typer/behandlingstema';
import {
    InfotrygdPerioderSkolepenger,
    TabellInfotrygdPerioder,
    TabellInfotrygdPerioderKompakt,
} from './TabellInfotrygdPerioder';

const InfotrygdPerioder: React.FC<{
    stønadstype: Stønadstype;
    visStørreTabell: boolean;
    perioder: InfotrygdPeriode[];
}> = ({ stønadstype, visStørreTabell, perioder }) => {
    if (perioder.length === 0) {
        return <>Ingen vedtaksperioder i Infotrygd</>;
    }
    const sammenslåttePerioder = slåSammenOgSorterPerioder(perioder);
    switch (stønadstype) {
        case Stønadstype.OVERGANGSSTØNAD:
        case Stønadstype.BARNETILSYN:
            return visStørreTabell ? (
                <TabellInfotrygdPerioder
                    perioder={sammenslåttePerioder}
                    stønadstype={stønadstype}
                />
            ) : (
                <TabellInfotrygdPerioderKompakt
                    perioder={sammenslåttePerioder}
                    stønadstype={stønadstype}
                />
            );
        case Stønadstype.SKOLEPENGER:
            return <InfotrygdPerioderSkolepenger perioder={sammenslåttePerioder} />;
    }
};

export default InfotrygdPerioder;
