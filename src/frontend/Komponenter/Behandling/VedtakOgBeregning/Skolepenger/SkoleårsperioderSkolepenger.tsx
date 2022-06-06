import { ISkoleårsperiodeSkolepenger } from '../../../../App/typer/vedtak';
import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import LeggTilKnapp from '../../../../Felles/Knapper/LeggTilKnapp';
import { ListState } from '../../../../App/hooks/felles/useListState';
import { FormErrors } from '../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './VedtaksformSkolepenger';
import { useApp } from '../../../../App/context/AppContext';
import { VEDTAK_OG_BEREGNING } from '../Felles/konstanter';
import SkoleårDelårsperiode from './SkoleårDelårsperiode';
import UtgiftsperiodeSkolepenger from './UtgiftsperiodeSkolepenger';
import { tomSkoleårsperiodeSkolepenger } from './typer';

const Skoleårsperiode = styled.div``;

interface Props {
    skoleårsperioder: ListState<ISkoleårsperiodeSkolepenger>;
    valideringsfeil?: FormErrors<InnvilgeVedtakForm>['perioder'];
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
}

const SkoleårsperioderSkolepenger: React.FC<Props> = ({
    skoleårsperioder,
    valideringsfeil,
    settValideringsFeil,
}) => {
    const { behandlingErRedigerbar } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();

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
            const perioder = (prevState.perioder ?? []).map((p, i) =>
                i !== index ? p : { ...p, [property]: formErrors }
            );
            return { ...prevState, perioder };
        });
    };
    return (
        <>
            {skoleårsperioder.value.map((skoleårsperiode, index) => {
                return (
                    <Skoleårsperiode key={index}>
                        <SkoleårDelårsperiode
                            data={skoleårsperiode.perioder}
                            oppdater={(perioder) =>
                                oppdaterSkoleårsperioder(index, 'perioder', perioder)
                            }
                            behandlingErRedigerbar={behandlingErRedigerbar}
                            valideringsfeil={valideringsfeil && valideringsfeil[index]?.perioder}
                            settValideringsFeil={(oppdatertePerioder) =>
                                oppdaterValideringsfeil(index, 'perioder', oppdatertePerioder)
                            }
                        />
                        <UtgiftsperiodeSkolepenger
                            data={skoleårsperiode.utgifter}
                            oppdater={(utgifter) =>
                                oppdaterSkoleårsperioder(index, 'utgifter', utgifter)
                            }
                            behandlingErRedigerbar={behandlingErRedigerbar}
                            valideringsfeil={valideringsfeil && valideringsfeil[index]?.utgifter}
                            settValideringsFeil={(oppdaterteUtgifter) =>
                                oppdaterValideringsfeil(index, 'utgifter', oppdaterteUtgifter)
                            }
                        />
                        <LeggTilKnapp
                            onClick={() => skoleårsperioder.push(tomSkoleårsperiodeSkolepenger)}
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
