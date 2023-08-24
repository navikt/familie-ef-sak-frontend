import { ISkoleårsperiodeSkolepenger } from '../../../../../App/typer/vedtak';
import React, { Dispatch, SetStateAction } from 'react';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { ListState } from '../../../../../App/hooks/felles/useListState';
import { FormErrors, Valideringsfunksjon } from '../../../../../App/hooks/felles/useFormState';
import { useApp } from '../../../../../App/context/AppContext';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import { InnvilgeVedtakForm, tomSkoleårsperiodeSkolepenger } from '../Felles/typer';
import { oppdaterValideringsfeil } from '../Felles/utils';
import LeggTilKnapp from '../../../../../Felles/Knapper/LeggTilKnapp';
import Skoleårsperiode from './Skoleårsperiode';

interface Props {
    customValidate: (fn: Valideringsfunksjon<InnvilgeVedtakForm>) => boolean;
    låsteUtgiftIder: string[];
    oppdaterHarUtførtBeregning: (beregningUtført: boolean) => void;
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
    skoleårsperioder: ListState<ISkoleårsperiodeSkolepenger>;
    valideringsfeil?: FormErrors<InnvilgeVedtakForm>['skoleårsperioder'];
}

const Skoleårsperioder: React.FC<Props> = ({
    customValidate,
    låsteUtgiftIder,
    oppdaterHarUtførtBeregning,
    settValideringsFeil,
    skoleårsperioder,
    valideringsfeil,
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
                return (
                    <Skoleårsperiode
                        låsteUtgiftIder={låsteUtgiftIder}
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
                            oppdaterteFeil
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
                    ikonPosisjon={'right'}
                    knappetekst="Legg til nytt skoleår"
                    onClick={() => skoleårsperioder.push(tomSkoleårsperiodeSkolepenger())}
                    variant="tertiary"
                />
            )}
        </>
    );
};

export default Skoleårsperioder;
