import { ISkoleårsperiodeSkolepenger } from '../../../../../App/typer/vedtak';
import React, { Dispatch, SetStateAction, useMemo } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { ListState } from '../../../../../App/hooks/felles/useListState';
import { useApp } from '../../../../../App/context/AppContext';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import navFarger from 'nav-frontend-core';
import FjernKnappMedTekst from '../../../../../Felles/Knapper/FjernKnappMedTekst';
import OpphørUtgiftsperiodeSkolepenger from './OpphørUtgiftsperiodeSkolepenger';
import { beregnSkoleår, GyldigSkoleår } from '../skoleår';
import KansellerKnapp from '../../../../../Felles/Knapper/KansellerKnapp';
import { locateIndexToRestorePreviousItemInCurrentItems, oppdaterValideringsfeil } from '../utils';
import SkoleårDelårsperiode from '../InnvilgetSkolepenger/SkoleårDelårsperiode';
import { FormErrors } from '../../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from '../InnvilgetSkolepenger/VedtaksformSkolepenger';

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
    valideringsfeil?: FormErrors<InnvilgeVedtakForm>['skoleårsperioder'];
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
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
    valideringsfeil,
    settValideringsFeil,
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

    /**
     * For å sette valideringsfeil på riktig indeks returneres periode og index til skoleårsperioden for nye perioder
     */
    const skoleårsperioderPerSkoleår = useMemo(
        () =>
            skoleårsperioder.value.reduce((acc, periode, index) => {
                if (periode.perioder.length > 0) {
                    return {
                        ...acc,
                        [beregnSkoleårForSkoleårsperiode(periode)]: { periode, index },
                    };
                } else {
                    return acc;
                }
            }, {} as Record<number, { periode: ISkoleårsperiodeSkolepenger; index: number } | undefined>),
        [skoleårsperioder]
    );

    return (
        <>
            {forrigeSkoleårsperioder.map((forrigeSkoleårsperiode, index) => {
                const skoleår = beregnSkoleårForSkoleårsperiode(forrigeSkoleårsperiode);
                const skoleårsperiode = skoleårsperioderPerSkoleår[skoleår];
                const erFjernet = !skoleårsperiode;
                return (
                    <Skoleårsperiode key={index}>
                        <SkoleårDelårsperiode
                            data={
                                erFjernet
                                    ? forrigeSkoleårsperiode.perioder
                                    : skoleårsperiode.periode.perioder
                            }
                            oppdater={(perioder) =>
                                skoleårsperiode &&
                                oppdaterSkoleårsperioder(
                                    skoleårsperiode.periode,
                                    'perioder',
                                    perioder
                                )
                            }
                            behandlingErRedigerbar={behandlingErRedigerbar && !erFjernet}
                            valideringsfeil={
                                valideringsfeil &&
                                skoleårsperiode &&
                                valideringsfeil[skoleårsperiode.index]?.perioder
                            }
                            settValideringsFeil={(oppdaterteFeil) =>
                                skoleårsperiode &&
                                oppdaterValideringsfeil(
                                    settValideringsFeil,
                                    skoleårsperiode.index,
                                    'perioder',
                                    oppdaterteFeil
                                )
                            }
                            skoleårErFjernet={erFjernet}
                            erOpphør={true}
                        />
                        <OpphørUtgiftsperiodeSkolepenger
                            data={skoleårsperiode?.periode?.utgiftsperioder || []}
                            forrigeData={forrigeSkoleårsperiode.utgiftsperioder}
                            skoleårErFjernet={erFjernet}
                            oppdater={(utgiftsperioder) =>
                                skoleårsperiode &&
                                oppdaterSkoleårsperioder(
                                    skoleårsperiode.periode,
                                    'utgiftsperioder',
                                    utgiftsperioder
                                )
                            }
                            behandlingErRedigerbar={behandlingErRedigerbar}
                        />
                        {behandlingErRedigerbar && !erFjernet && (
                            <FjernKnappMedTekst
                                onClick={() => fjernSkoleårsperiode(skoleårsperiode.periode)}
                                knappetekst="Opphør skoleår"
                            />
                        )}
                        {behandlingErRedigerbar && erFjernet && (
                            <KansellerKnapp
                                onClick={() => tilbakestillSkoleårsperiode(index)}
                                knappetekst="Tilbakestill skoleår"
                                visKnapptekst={true}
                            />
                        )}
                    </Skoleårsperiode>
                );
            })}
        </>
    );
};

export default OpphørSkolepenger;
