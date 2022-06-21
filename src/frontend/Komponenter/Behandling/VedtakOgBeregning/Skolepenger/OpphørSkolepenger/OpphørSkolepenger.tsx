import { ISkoleårsperiodeSkolepenger } from '../../../../../App/typer/vedtak';
import React, { Dispatch, SetStateAction, useMemo } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { ListState } from '../../../../../App/hooks/felles/useListState';
import { FormErrors } from '../../../../../App/hooks/felles/useFormState';
import { useApp } from '../../../../../App/context/AppContext';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import navFarger from 'nav-frontend-core';
import FjernKnappMedTekst from '../../../../../Felles/Knapper/FjernKnappMedTekst';
import OpphørSkoleårDelårsperiode from './OpphørSkoleårDelårsperiode';
import OpphørUtgiftsperiodeSkolepenger from './OpphørUtgiftsperiodeSkolepenger';
import { beregnSkoleår, GyldigSkoleår } from '../skoleår';
import { InnvilgeVedtakForm } from '../InnvilgetSkolepenger/VedtaksformSkolepenger';
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
    valideringsfeil?: FormErrors<InnvilgeVedtakForm>['skoleårsperioder'];
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
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
    valideringsfeil,
    settValideringsFeil,
    oppdaterHarUtførtBeregning,
}) => {
    const { behandlingErRedigerbar } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();

    const fjernSkoleårsperiode = (skoleårsperiode: ISkoleårsperiodeSkolepenger) => {
        const index = skoleårsperioder.value.indexOf(skoleårsperiode);
        skoleårsperioder.remove(index);
        settValideringsFeil((prevState: FormErrors<InnvilgeVedtakForm>) => ({
            ...prevState,
            skoleårsperioder: (prevState.skoleårsperioder || []).filter((_, i) => index !== i),
        }));
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

    const oppdaterSkoleårsperioder = <T extends ISkoleårsperiodeSkolepenger>(
        index: number,
        property: keyof T,
        value: T[keyof T]
    ) => {
        const skoleårsperiode = skoleårsperioder.value[index];
        skoleårsperioder.update({ ...skoleårsperiode, [property]: value }, index);
        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
        oppdaterHarUtførtBeregning(false);
    };

    const oppdaterValideringsfeil = <T extends ISkoleårsperiodeSkolepenger, T2 extends T[keyof T]>(
        index: number,
        property: keyof T,
        formErrors: FormErrors<T2 extends Array<infer U> ? U[] : T2>
    ) => {
        settValideringsFeil((prevState: FormErrors<InnvilgeVedtakForm>) => {
            const skoleårsperioder = (prevState.skoleårsperioder ?? []).map((p, i) =>
                i !== index ? p : { ...p, [property]: formErrors }
            );
            return { ...prevState, skoleårsperioder };
        });
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
                            forrigePerioder={forrigeSkoleårsperiode.perioder}
                            skoleårErFjernet={erFjernet}
                            oppdater={(perioder) =>
                                oppdaterSkoleårsperioder(index, 'perioder', perioder)
                            }
                            behandlingErRedigerbar={behandlingErRedigerbar}
                            valideringsfeil={valideringsfeil && valideringsfeil[index]?.perioder}
                            settValideringsFeil={(oppdaterteFeil) =>
                                oppdaterValideringsfeil(index, 'perioder', oppdaterteFeil)
                            }
                        />
                        <OpphørUtgiftsperiodeSkolepenger
                            data={skoleårsperiode?.utgiftsperioder || []}
                            forrigeUtgifter={forrigeSkoleårsperiode.utgiftsperioder}
                            skoleårErFjernet={erFjernet}
                            oppdater={(utgiftsperioder) =>
                                oppdaterSkoleårsperioder(index, 'utgiftsperioder', utgiftsperioder)
                            }
                            behandlingErRedigerbar={behandlingErRedigerbar}
                            valideringsfeil={
                                valideringsfeil && valideringsfeil[index]?.utgiftsperioder
                            }
                            settValideringsFeil={(oppdaterteFeil) =>
                                oppdaterValideringsfeil(index, 'utgiftsperioder', oppdaterteFeil)
                            }
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
