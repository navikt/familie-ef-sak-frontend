import { ISkoleårsperiodeSkolepenger } from '../../../../../App/typer/vedtak';
import React, { Dispatch, SetStateAction, useMemo } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { ListState } from '../../../../../App/hooks/felles/useListState';
import { useApp } from '../../../../../App/context/AppContext';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import { beregnSkoleår, GyldigBeregnetSkoleår } from '../Felles/skoleår';
import {
    locateIndexToRestorePreviousItemInCurrentItems,
    oppdaterValideringsfeil,
} from '../Felles/utils';
import Delårsperioder from './Delårsperioder';
import { FormErrors } from '../../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from '../Felles/typer';
import FjernKnapp from '../../../../../Felles/Knapper/FjernKnapp';
import TilbakestillKnapp from '../../../../../Felles/Knapper/TilbakestillKnapp';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';
import Utgiftsperioder from './Utgiftsperioder';

const Skoleårsperiode = styled.div`
    display: flex;
    flex-direction: column;
    row-gap: 0.75rem;
    padding: 1rem;
    background-color: ${AGray50};
`;

const TilbakestillButton = styled(TilbakestillKnapp)`
    margin-bottom: 0.25rem;
`;

interface Props {
    skoleårsperioder: ListState<ISkoleårsperiodeSkolepenger>;
    skoleårsperioderForrigeVedtak: ISkoleårsperiodeSkolepenger[];
    valideringsfeil: FormErrors<InnvilgeVedtakForm>['skoleårsperioder'];
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
}

const beregnSkoleårForSkoleårsperiode = (periode: ISkoleårsperiodeSkolepenger) => {
    return (
        beregnSkoleår(
            periode.perioder[0].årMånedFra,
            periode.perioder[0].årMånedTil
        ) as GyldigBeregnetSkoleår
    ).skoleår;
};

const OpphøreVedtak: React.FC<Props> = ({
    skoleårsperioder,
    skoleårsperioderForrigeVedtak,
    valideringsfeil,
    settValideringsFeil,
}) => {
    const { behandlingErRedigerbar } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();

    const fjernSkoleårsperiode = (skoleårsperiode: ISkoleårsperiodeSkolepenger) => {
        const index = skoleårsperioder.value.indexOf(skoleårsperiode);
        skoleårsperioder.remove(index);
        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
    };

    const tilbakestillSkoleårsperiode = (forrigeIndex: number) => {
        const indexForElementFørId = locateIndexToRestorePreviousItemInCurrentItems(
            forrigeIndex,
            skoleårsperioder.value,
            skoleårsperioderForrigeVedtak,
            (t1, t2) => beregnSkoleårForSkoleårsperiode(t1) === beregnSkoleårForSkoleårsperiode(t2)
        );
        skoleårsperioder.setValue((prevState) => {
            return [
                ...prevState.slice(0, indexForElementFørId),
                skoleårsperioderForrigeVedtak[forrigeIndex],
                ...prevState.slice(indexForElementFørId, prevState.length),
            ];
        });
        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
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
    };

    /**
     * For å sette valideringsfeil på riktig indeks returneres periode og index til skoleårsperioden for nye perioder
     */
    const skoleårsperioderPerSkoleår = useMemo(
        () =>
            skoleårsperioder.value.reduce(
                (acc, periode, index) => {
                    if (periode.perioder.length > 0) {
                        return {
                            ...acc,
                            [beregnSkoleårForSkoleårsperiode(periode)]: { periode, index },
                        };
                    } else {
                        return acc;
                    }
                },
                {} as Record<
                    number,
                    { periode: ISkoleårsperiodeSkolepenger; index: number } | undefined
                >
            ),
        [skoleårsperioder]
    );

    return (
        <>
            {skoleårsperioderForrigeVedtak.map((forrigeSkoleårsperiode, index) => {
                const skoleår = beregnSkoleårForSkoleårsperiode(forrigeSkoleårsperiode);
                const skoleårsperiode = skoleårsperioderPerSkoleår[skoleår];
                const skoleårsperiodeErOpphørt = !skoleårsperiode;
                return (
                    <Skoleårsperiode key={index}>
                        <Delårsperioder
                            data={
                                skoleårsperiodeErOpphørt
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
                            behandlingErRedigerbar={
                                behandlingErRedigerbar && !skoleårsperiodeErOpphørt
                            }
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
                            erSkoleårOpphørt={skoleårsperiodeErOpphørt}
                            erOpphør={true}
                        />
                        <Utgiftsperioder
                            behandlingErRedigerbar={behandlingErRedigerbar}
                            data={skoleårsperiode?.periode?.utgiftsperioder || []}
                            forrigeData={forrigeSkoleårsperiode.utgiftsperioder}
                            oppdater={(utgiftsperioder) =>
                                skoleårsperiode &&
                                oppdaterSkoleårsperioder(
                                    skoleårsperiode.periode,
                                    'utgiftsperioder',
                                    utgiftsperioder
                                )
                            }
                            skoleårErOpphørt={skoleårsperiodeErOpphørt}
                        />
                        {behandlingErRedigerbar && !skoleårsperiodeErOpphørt && (
                            <FjernKnapp
                                onClick={() => fjernSkoleårsperiode(skoleårsperiode.periode)}
                                knappetekst={'Fjern skoleårsperide'}
                            />
                        )}
                        {behandlingErRedigerbar && skoleårsperiodeErOpphørt && (
                            <TilbakestillButton
                                onClick={() => tilbakestillSkoleårsperiode(index)}
                                knappetekst={'Tilbakestill skoleår'}
                            />
                        )}
                    </Skoleårsperiode>
                );
            })}
        </>
    );
};

export default OpphøreVedtak;
