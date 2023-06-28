import {
    IPeriodeSkolepenger,
    ISkoleårsperiodeSkolepenger,
    SkolepengerUtgift,
} from '../../../../../App/typer/vedtak';
import React, { Dispatch, SetStateAction } from 'react';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { ListState } from '../../../../../App/hooks/felles/useListState';
import { FormErrors, Valideringsfunksjon } from '../../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './VedtaksformSkolepenger';
import { useApp } from '../../../../../App/context/AppContext';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import { tomSkoleårsperiodeSkolepenger } from '../typer';
import { oppdaterValideringsfeil } from '../utils';
import LeggTilKnapp from '../../../../../Felles/Knapper/LeggTilKnapp';
import Skoleårsperiode from './Skoleårsperiode';

interface Props {
    customValidate: (fn: Valideringsfunksjon<InnvilgeVedtakForm>) => boolean;
    skoleårsperioder: ListState<ISkoleårsperiodeSkolepenger>;
    låsteUtgiftIder: string[];
    valideringsfeil?: FormErrors<InnvilgeVedtakForm>['skoleårsperioder'];
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
    oppdaterHarUtførtBeregning: (beregningUtført: boolean) => void;
}

const Skoleårsperioder: React.FC<Props> = ({
    customValidate,
    skoleårsperioder,
    valideringsfeil,
    settValideringsFeil,
    oppdaterHarUtførtBeregning,
}) => {
    const { behandlingErRedigerbar } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();

    const fjernSkoleårsperiode = (index: number) => {
        skoleårsperioder.remove(index);
        settValideringsFeil((prevState: FormErrors<InnvilgeVedtakForm>) => ({
            ...prevState,
            skoleårsperioder: (prevState.skoleårsperioder || []).filter((_, i) => index !== i),
        }));
        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
        oppdaterHarUtførtBeregning(false);
    };

    const oppdaterSkoleårsperiode = <T extends ISkoleårsperiodeSkolepenger>(
        index: number,
        property: keyof T,
        value: T[keyof T]
    ) => {
        const skoleårsperiode = skoleårsperioder.value[index];
        skoleårsperioder.update({ ...skoleårsperiode, [property]: value }, index);
        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
        oppdaterHarUtførtBeregning(false);
    };

    return (
        <>
            {skoleårsperioder.value.map((skoleårsperiode, index) => {
                // const inneholderLåsteUtgifter = skoleårsperiode.utgiftsperioder.some(
                //     (utgift) => låsteUtgiftIder.indexOf(utgift.id) > -1
                // );
                // const skalViseFjernKnapp =
                //     behandlingErRedigerbar && index !== 0 && !inneholderLåsteUtgifter;
                return (
                    <Skoleårsperiode
                        customValidate={customValidate}
                        fjernSkoleårsperiode={() => fjernSkoleårsperiode(index)}
                        key={index}
                        skoleårsperiode={skoleårsperiode}
                        oppdaterSkoleårsperiode={(
                            property: keyof ISkoleårsperiodeSkolepenger,
                            value: ISkoleårsperiodeSkolepenger[keyof ISkoleårsperiodeSkolepenger]
                        ) => oppdaterSkoleårsperiode(index, property, value)}
                        oppdaterValideringsfeil={(
                            property: keyof ISkoleårsperiodeSkolepenger,
                            oppdaterteFeil:
                                | FormErrors<SkolepengerUtgift>[]
                                | FormErrors<IPeriodeSkolepenger>[]
                        ) =>
                            oppdaterValideringsfeil(
                                settValideringsFeil,
                                index,
                                property,
                                oppdaterteFeil
                            )
                        }
                        valideringsfeil={valideringsfeil && valideringsfeil[index]}
                    />
                );
            })}
            {behandlingErRedigerbar && (
                <LeggTilKnapp
                    onClick={() => skoleårsperioder.push(tomSkoleårsperiodeSkolepenger())}
                    knappetekst="Legg til nytt skoleår"
                    variant="tertiary"
                />
            )}
        </>
    );
};

export default Skoleårsperioder;
