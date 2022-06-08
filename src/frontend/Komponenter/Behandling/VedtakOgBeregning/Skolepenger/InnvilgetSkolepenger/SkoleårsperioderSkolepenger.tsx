import { ISkoleårsperiodeSkolepenger } from '../../../../../App/typer/vedtak';
import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import LeggTilKnapp from '../../../../../Felles/Knapper/LeggTilKnapp';
import { ListState } from '../../../../../App/hooks/felles/useListState';
import { FormErrors } from '../../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './VedtaksformSkolepenger';
import { useApp } from '../../../../../App/context/AppContext';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import SkoleårDelårsperiode from './SkoleårDelårsperiode';
import UtgiftsperiodeSkolepenger from './UtgiftsperiodeSkolepenger';
import { tomSkoleårsperiodeSkolepenger } from '../typer';
import FjernKnapp from '../../../../../Felles/Knapper/FjernKnapp';

const Skoleårsperiode = styled.div``;

interface Props {
    skoleårsperioder: ListState<ISkoleårsperiodeSkolepenger>;
    låsteUtgiftIder: string[];
    valideringsfeil?: FormErrors<InnvilgeVedtakForm>['skoleårsperioder'];
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
}

const SkoleårsperioderSkolepenger: React.FC<Props> = ({
    skoleårsperioder,
    låsteUtgiftIder,
    valideringsfeil,
    settValideringsFeil,
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
    };

    const oppdaterSkoleårsperioder = <T extends ISkoleårsperiodeSkolepenger>(
        index: number,
        property: keyof T,
        value: T[keyof T]
    ) => {
        const skoleårsperiode = skoleårsperioder.value[index];
        skoleårsperioder.update({ ...skoleårsperiode, [property]: value }, index);
        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
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
    return (
        <>
            {skoleårsperioder.value.map((skoleårsperiode, index) => {
                const inneholderLåsteUtgifter = skoleårsperiode.utgiftsperioder.some(
                    (utgift) => låsteUtgiftIder.indexOf(utgift.id) > -1
                );
                const skalViseFjernKnapp =
                    behandlingErRedigerbar &&
                    index === skoleårsperioder.value.length - 1 &&
                    index !== 0 &&
                    !inneholderLåsteUtgifter;
                return (
                    <Skoleårsperiode key={index}>
                        <SkoleårDelårsperiode
                            data={skoleårsperiode.perioder}
                            oppdater={(perioder) =>
                                oppdaterSkoleårsperioder(index, 'perioder', perioder)
                            }
                            behandlingErRedigerbar={behandlingErRedigerbar}
                            valideringsfeil={valideringsfeil && valideringsfeil[index]?.perioder}
                            settValideringsFeil={(oppdaterteFeil) =>
                                oppdaterValideringsfeil(index, 'perioder', oppdaterteFeil)
                            }
                        />
                        <UtgiftsperiodeSkolepenger
                            data={skoleårsperiode.utgiftsperioder}
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
                            låsteUtgiftIder={låsteUtgiftIder}
                        />
                        {skalViseFjernKnapp && (
                            <FjernKnapp
                                onClick={() => fjernSkoleårsperiode(index)}
                                knappetekst="Fjern skoleår"
                                disabled={inneholderLåsteUtgifter}
                            />
                        )}
                        <LeggTilKnapp
                            onClick={() => skoleårsperioder.push(tomSkoleårsperiodeSkolepenger())}
                            knappetekst="Legg til skoleår"
                            hidden={!behandlingErRedigerbar}
                        />
                    </Skoleårsperiode>
                );
            })}
        </>
    );
};

export default SkoleårsperioderSkolepenger;
