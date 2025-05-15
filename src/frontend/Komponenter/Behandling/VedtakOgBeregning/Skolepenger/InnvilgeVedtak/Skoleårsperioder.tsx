import { ISkoleårsperiodeSkolepenger } from '../../../../../App/typer/vedtak';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { ListState } from '../../../../../App/hooks/felles/useListState';
import { FormErrors, Valideringsfunksjon } from '../../../../../App/hooks/felles/useFormState';
import { useApp } from '../../../../../App/context/AppContext';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import { InnvilgeVedtakForm, tomSkoleårsperiodeSkolepenger } from '../Felles/typer';
import { oppdaterValideringsfeil } from '../Felles/utils';
import LeggTilKnapp from '../../../../../Felles/Knapper/LeggTilKnapp';
import Skoleårsperiode from './Skoleårsperiode';
import { Knapp } from '../../../../../Felles/Knapper/HovedKnapp';
import { ChevronDownIcon, ChevronUpIcon } from '@navikt/aksel-icons';

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
    const [visTidligereSkoleår, settVisTidligereSkoleår] = useState<boolean>(false);

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

    const antallUlagredeSkoleårsperioder = skoleårsperioder.value.filter(
        (skoleårsperiode) => !skoleårsperiode.erHentetFraBackend
    ).length;

    const skoleårsperioderReversert = skoleårsperioder.value.toReversed();

    return (
        <>
            {behandlingErRedigerbar && (
                <LeggTilKnapp
                    ikonPosisjon={'right'}
                    knappetekst="Legg til nytt skoleår"
                    onClick={() => skoleårsperioder.push(tomSkoleårsperiodeSkolepenger())}
                    variant="tertiary"
                />
            )}
            {skoleårsperioderReversert.map((skoleårsperiode, indexReversertListe) => {
                const indexOriginalListe = skoleårsperioder.value.length - indexReversertListe - 1;

                const skalViseSkoleår =
                    visTidligereSkoleår ||
                    indexReversertListe === 0 ||
                    !skoleårsperiode.erHentetFraBackend ||
                    indexReversertListe === antallUlagredeSkoleårsperioder;

                return skalViseSkoleår ? (
                    <Skoleårsperiode
                        låsteUtgiftIder={låsteUtgiftIder}
                        customValidate={customValidate}
                        fjernSkoleårsperiode={() => fjernSkoleårsperiode(indexOriginalListe)}
                        key={indexOriginalListe}
                        skoleårsperiode={skoleårsperiode}
                        oppdaterSkoleårsperiode={(
                            property: keyof ISkoleårsperiodeSkolepenger,
                            value: ISkoleårsperiodeSkolepenger[keyof ISkoleårsperiodeSkolepenger]
                        ) => oppdaterSkoleårsperiode(indexOriginalListe, property, value)}
                        oppdaterValideringsfeil={(
                            property: keyof ISkoleårsperiodeSkolepenger,
                            oppdaterteFeil
                        ) =>
                            oppdaterValideringsfeil(
                                settValideringsFeil,
                                indexOriginalListe,
                                property,
                                oppdaterteFeil
                            )
                        }
                        valideringsfeil={valideringsfeil && valideringsfeil[indexOriginalListe]}
                    />
                ) : null;
            })}
            <Knapp
                icon={visTidligereSkoleår ? <ChevronUpIcon /> : <ChevronDownIcon />}
                variant={'tertiary'}
                size={'medium'}
                iconPosition={'left'}
                type={'button'}
                onClick={() => {
                    settVisTidligereSkoleår((prevState) => !prevState);
                }}
            >
                {visTidligereSkoleår ? 'Skjul tidligere skoleår' : 'Vis tidligere skoleår'}
            </Knapp>
        </>
    );
};

export default Skoleårsperioder;
