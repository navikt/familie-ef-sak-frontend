import { InfotrygdPeriode } from '../../App/typer/infotrygd';
import React from 'react';
import { slåSammenOgSorterPerioder } from '../Infotrygd/grupperInfotrygdperiode';
import { Stønadstype } from '../../App/typer/behandlingstema';
import {
    InfotrygdPerioderSkolepenger,
    TabellInfotrygdBarnetilsynperioderKompakt,
    TabellInfotrygdOvergangsstønadperioderKompakt,
} from './TabellInfotrygdPerioder';

const InfotrygdPerioder: React.FC<{
    stønadstype: Stønadstype;
    perioder: InfotrygdPeriode[];
}> = ({ stønadstype, perioder }) => {
    if (perioder.length === 0) {
        return <>Ingen vedtaksperioder i Infotrygd</>;
    }
    const sammenslåttePerioder = slåSammenOgSorterPerioder(perioder);
    switch (stønadstype) {
        case Stønadstype.OVERGANGSSTØNAD:
            return (
                <TabellInfotrygdOvergangsstønadperioderKompakt perioder={sammenslåttePerioder} />
            );
        case Stønadstype.BARNETILSYN:
            return <TabellInfotrygdBarnetilsynperioderKompakt perioder={sammenslåttePerioder} />;
        case Stønadstype.SKOLEPENGER:
            return <InfotrygdPerioderSkolepenger perioder={sammenslåttePerioder} />;
    }
};

export default InfotrygdPerioder;
