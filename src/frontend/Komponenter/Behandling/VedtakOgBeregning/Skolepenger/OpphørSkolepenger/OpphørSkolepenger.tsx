import { ISkoleårsperiodeSkolepenger } from '../../../../../App/typer/vedtak';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { ListState } from '../../../../../App/hooks/felles/useListState';
import { useApp } from '../../../../../App/context/AppContext';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import navFarger from 'nav-frontend-core';
import FjernKnappMedTekst from '../../../../../Felles/Knapper/FjernKnappMedTekst';
import OpphørSkoleårDelårsperiode from './OpphørSkoleårDelårsperiode';
import OpphørUtgiftsperiodeSkolepenger from './OpphørUtgiftsperiodeSkolepenger';
import { beregnSkoleår, GyldigSkoleår } from '../skoleår';
import KansellerKnapp from '../../../../../Felles/Knapper/KansellerKnapp';
import {
    locateIndexToRestorePreviousItemInCurrentItems,
    sjekkHarValgtAlleUtgiftstyper,
} from '../utils';

const Skoleårsperiode = styled.div`
    margin: 1rem;
    margin-right: 0.5rem;
    margin-left: 0rem;
    padding: 1rem;
    background-color: ${navFarger.navGraBakgrunn};
`;

interface Props {
    skoleårsperioder: ListState<ISkoleårsperiodeSkolepenger>;
    forrigeSkoleårsperioder: ISkoleårsperiodeSkolepenger[];
    oppdaterHarUtførtBeregning: (beregningUtført: boolean) => void;
}

const beregnSkoleårForSkoleårsperiode = (periode: ISkoleårsperiodeSkolepenger) => {
    return (
        beregnSkoleår(
            periode.perioder[0].årMånedFra,
            periode.perioder[0].årMånedTil
        ) as GyldigSkoleår
    ).skoleår;
};

const OpphørSkolepenger: React.FC<Props> = ({
    skoleårsperioder,
    forrigeSkoleårsperioder,
    oppdaterHarUtførtBeregning,
}) => {
    const { behandlingErRedigerbar } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();

    const fjernSkoleårsperiode = (skoleårsperiode: ISkoleårsperiodeSkolepenger) => {
        const index = skoleårsperioder.value.indexOf(skoleårsperiode);
        skoleårsperioder.remove(index);
        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
        oppdaterHarUtførtBeregning(false);
    };

    const tilbakestillSkoleårsperiode = (forrigeIndex: number) => {
        const indexForElementFørId = locateIndexToRestorePreviousItemInCurrentItems(
            forrigeIndex,
            skoleårsperioder.value,
            forrigeSkoleårsperioder,
            (t1, t2) => beregnSkoleårForSkoleårsperiode(t1) === beregnSkoleårForSkoleårsperiode(t2)
        );
        skoleårsperioder.setValue((prevState) => {
            return [
                ...prevState.slice(0, indexForElementFørId),
                forrigeSkoleårsperioder[forrigeIndex],
                ...prevState.slice(indexForElementFørId, prevState.length),
            ];
        });
        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
        oppdaterHarUtførtBeregning(false);
    };

    /**
     * Sender med previousValue som er item i data som skal oppdateres
     * Denne brukes for å finne index i skoleårsperioder
     */
    const oppdaterSkoleårsperioder = <T extends ISkoleårsperiodeSkolepenger>(
        previousValue: T,
        property: keyof T,
        value: T[keyof T]
    ) => {
        const index = skoleårsperioder.value.indexOf(previousValue);
        const skoleårsperiode = skoleårsperioder.value[index];
        skoleårsperioder.update({ ...skoleårsperiode, [property]: value }, index);
        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
        oppdaterHarUtførtBeregning(false);
    };

    const harValgtAlleUtgiftstyper = sjekkHarValgtAlleUtgiftstyper(forrigeSkoleårsperioder);

    const skoleårsperioderPerSkoleår = useMemo(
        () =>
            skoleårsperioder.value.reduce((acc, curr) => {
                if (curr.perioder.length > 0) {
                    return {
                        ...acc,
                        [beregnSkoleårForSkoleårsperiode(curr)]: curr,
                    };
                } else {
                    return acc;
                }
            }, {} as Record<number, ISkoleårsperiodeSkolepenger>),
        [skoleårsperioder]
    );

    return (
        <>
            {forrigeSkoleårsperioder.map((forrigeSkoleårsperiode, index) => {
                const skalViseFjernKnapp = behandlingErRedigerbar;
                const skoleår = beregnSkoleårForSkoleårsperiode(forrigeSkoleårsperiode);
                const skoleårsperiode = skoleårsperioderPerSkoleår[skoleår];
                const erFjernet = !skoleårsperiode;
                return (
                    <Skoleårsperiode key={index}>
                        <OpphørSkoleårDelårsperiode
                            data={skoleårsperiode?.perioder || []}
                            forrigeData={forrigeSkoleårsperiode.perioder}
                            skoleårErFjernet={erFjernet}
                            oppdater={(perioder) =>
                                oppdaterSkoleårsperioder(skoleårsperiode, 'perioder', perioder)
                            }
                            behandlingErRedigerbar={behandlingErRedigerbar}
                        />
                        <OpphørUtgiftsperiodeSkolepenger
                            data={skoleårsperiode?.utgiftsperioder || []}
                            forrigeData={forrigeSkoleårsperiode.utgiftsperioder}
                            skoleårErFjernet={erFjernet}
                            oppdater={(utgiftsperioder) =>
                                oppdaterSkoleårsperioder(
                                    skoleårsperiode,
                                    'utgiftsperioder',
                                    utgiftsperioder
                                )
                            }
                            behandlingErRedigerbar={behandlingErRedigerbar}
                            harValgtAlleUtgiftstyper={harValgtAlleUtgiftstyper}
                        />
                        {skalViseFjernKnapp && !erFjernet && (
                            <FjernKnappMedTekst
                                onClick={() => fjernSkoleårsperiode(skoleårsperiode)}
                                knappetekst="Fjern skoleår"
                            />
                        )}
                        {skalViseFjernKnapp && erFjernet && (
                            <KansellerKnapp
                                onClick={() => tilbakestillSkoleårsperiode(index)}
                                knappetekst="Tilbakestill skoleår"
                            />
                        )}
                    </Skoleårsperiode>
                );
            })}
        </>
    );
};

export default OpphørSkolepenger;
