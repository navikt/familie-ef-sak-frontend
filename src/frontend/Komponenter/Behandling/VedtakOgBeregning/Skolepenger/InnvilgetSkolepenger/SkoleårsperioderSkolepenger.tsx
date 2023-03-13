import { ISkoleårsperiodeSkolepenger } from '../../../../../App/typer/vedtak';
import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { ListState } from '../../../../../App/hooks/felles/useListState';
import { FormErrors } from '../../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './VedtaksformSkolepenger';
import { useApp } from '../../../../../App/context/AppContext';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import SkoleårDelårsperiode from './SkoleårDelårsperiode';
import UtgiftsperiodeSkolepenger from './UtgiftsperiodeSkolepenger';
import { tomSkoleårsperiodeSkolepenger } from '../typer';
import { oppdaterValideringsfeil } from '../utils';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';
import { HorizontalScroll } from '../../Felles/HorizontalScroll';
import DisplayBlockKnapp, { Variant } from '../../../../../Felles/Knapper/DisplayBlockKnapp';

const Skoleårsperiode = styled(HorizontalScroll)`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background-color: ${AGray50};
`;

interface Props {
    skoleårsperioder: ListState<ISkoleårsperiodeSkolepenger>;
    låsteUtgiftIder: string[];
    valideringsfeil?: FormErrors<InnvilgeVedtakForm>['skoleårsperioder'];
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
    oppdaterHarUtførtBeregning: (beregningUtført: boolean) => void;
}

const SkoleårsperioderSkolepenger: React.FC<Props> = ({
    skoleårsperioder,
    låsteUtgiftIder,
    valideringsfeil,
    settValideringsFeil,
    oppdaterHarUtførtBeregning,
}) => {
    const { behandlingErRedigerbar, åpenHøyremeny } = useBehandling();
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

    return (
        <>
            {skoleårsperioder.value.map((skoleårsperiode, index) => {
                const inneholderLåsteUtgifter = skoleårsperiode.utgiftsperioder.some(
                    (utgift) => låsteUtgiftIder.indexOf(utgift.id) > -1
                );
                const skalViseFjernKnapp =
                    behandlingErRedigerbar && index !== 0 && !inneholderLåsteUtgifter;
                return (
                    <Skoleårsperiode
                        key={index}
                        synligVedLukketMeny={'1035px'}
                        synligVedÅpenMeny={'1330px'}
                        åpenHøyremeny={åpenHøyremeny}
                    >
                        <SkoleårDelårsperiode
                            data={skoleårsperiode.perioder}
                            oppdater={(perioder) =>
                                oppdaterSkoleårsperioder(index, 'perioder', perioder)
                            }
                            behandlingErRedigerbar={behandlingErRedigerbar}
                            valideringsfeil={valideringsfeil && valideringsfeil[index]?.perioder}
                            settValideringsFeil={(oppdaterteFeil) =>
                                oppdaterValideringsfeil(
                                    settValideringsFeil,
                                    index,
                                    'perioder',
                                    oppdaterteFeil
                                )
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
                                oppdaterValideringsfeil(
                                    settValideringsFeil,
                                    index,
                                    'utgiftsperioder',
                                    oppdaterteFeil
                                )
                            }
                            låsteUtgiftIder={låsteUtgiftIder}
                        />
                        {skalViseFjernKnapp && (
                            <DisplayBlockKnapp
                                onClick={() => fjernSkoleårsperiode(index)}
                                knappetekst={'Fjern skoleårsperiode'}
                                variant={Variant.FJERN}
                            />
                        )}
                    </Skoleårsperiode>
                );
            })}
            {behandlingErRedigerbar && (
                <DisplayBlockKnapp
                    onClick={() => skoleårsperioder.push(tomSkoleårsperiodeSkolepenger())}
                    knappetekst="Legg til skoleår"
                    variant={Variant.LEGG_TIL}
                />
            )}
        </>
    );
};

export default SkoleårsperioderSkolepenger;
