import {
    ESkolepengerStudietype,
    IPeriodeSkolepenger,
    ISkoleårsperiodeSkolepenger,
    skolepengerStudietypeTilTekst,
    SkolepengerUtgift,
} from '../../../../App/typer/vedtak';
import MånedÅrPeriode, { PeriodeVariant } from '../../../../Felles/Input/MånedÅr/MånedÅrPeriode';
import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import LeggTilKnapp from '../../../../Felles/Knapper/LeggTilKnapp';
import FjernKnapp from '../../../../Felles/Knapper/FjernKnapp';
import { ListState } from '../../../../App/hooks/felles/useListState';
import { Element } from 'nav-frontend-typografi';
import { FormErrors } from '../../../../App/hooks/felles/useFormState';
import { harTallverdi, tilHeltall, tilTallverdi } from '../../../../App/utils/utils';
import InputMedTusenSkille from '../../../../Felles/Visningskomponenter/InputMedTusenskille';
import { FamilieSelect } from '@navikt/familie-form-elements';
import InputUtenSpinner from '../../../../Felles/Visningskomponenter/InputUtenSpinner';
import MånedÅrVelger from '../../../../Felles/Input/MånedÅr/MånedÅrVelger';
import { InnvilgeVedtakForm } from './VedtaksformSkolepenger';
import { useApp } from '../../../../App/context/AppContext';
import { VEDTAK_OG_BEREGNING } from '../Felles/konstanter';

const SkoleårsperiodeRad = styled.div<{ lesevisning?: boolean; erHeader?: boolean }>`
    display: grid;
    grid-template-areas: 'studietype fraOgMedVelger tilOgMedVelger studiebelastning';
    grid-template-columns: ${(props) =>
        props.lesevisning ? '10rem 10rem 10rem 7rem' : '12rem 12rem 12rem 8rem 4rem'};
    grid-gap: ${(props) => (props.lesevisning ? '0.5rem' : '1rem')};
    margin-bottom: ${(props) => (props.erHeader ? '0,5rem' : 0)};
`;

const Utgiftsrad = styled.div<{ lesevisning?: boolean; erHeader?: boolean }>`
    display: grid;
    grid-template-areas: 'fraOgMedVelger utgifter stønad';
    grid-template-columns: ${(props) =>
        props.lesevisning ? '10rem 10rem 5rem' : '12rem 12rem 5rem 4rem'};
    grid-gap: ${(props) => (props.lesevisning ? '0.5rem' : '1rem')};
    margin-bottom: ${(props) => (props.erHeader ? '0,5rem' : 0)};
`;

const Skoleårsperiode = styled.div``;

const StyledInputMedTusenSkille = styled(InputMedTusenSkille)`
    text-align: left;
`;

const StyledInput = styled(InputUtenSpinner)`
    text-align: left;
`;

const StyledSelect = styled(FamilieSelect)`
    min-width: 140px;
    max-width: 200px;
`;

interface Props {
    skoleårsperioder: ListState<ISkoleårsperiodeSkolepenger>;
    valideringsfeil?: FormErrors<InnvilgeVedtakForm>['perioder'];
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
}

interface ValideringsPropsMedOppdatering<T> {
    data: T[];
    oppdater: (data: T[]) => void;
    behandlingErRedigerbar: boolean;
    valideringsfeil?: FormErrors<T>[];
    settValideringsFeil: (errors: FormErrors<T>[]) => void;
}

export const tomSkoleårsperiode: IPeriodeSkolepenger = {
    studietype: undefined,
    årMånedFra: '',
    årMånedTil: '',
    studiebelastning: undefined,
};

export const tomUtgift: SkolepengerUtgift = {
    årMånedFra: '',
    utgifter: undefined,
    stønad: undefined,
};

export const tomSkoleårsperiodeSkolepenger: ISkoleårsperiodeSkolepenger = {
    perioder: [tomSkoleårsperiode],
    utgifter: [tomUtgift],
};

const Skoleårsperioder: React.FC<Props> = ({
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
                        <PerioderForSkoleår
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
                        <UtgiftsperioderForSkoleår
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

const PerioderForSkoleår: React.FC<ValideringsPropsMedOppdatering<IPeriodeSkolepenger>> = ({
    data,
    oppdater,
    behandlingErRedigerbar,
    valideringsfeil,
    settValideringsFeil,
}) => {
    const oppdaterUtgiftsPeriode = (
        index: number,
        property: keyof IPeriodeSkolepenger,
        value: string | number | undefined
    ) => {
        oppdater(
            data.map((periode, i) => (index === i ? { ...periode, [property]: value } : periode))
        );
    };

    const oppdaterStudietype = (studietype: ESkolepengerStudietype) => {
        console.log(data.length);
        oppdater(data.map((periode) => ({ ...periode, studietype })));
    };

    const periodeVariantTilUtgiftsperiodeProperty = (
        periodeVariant: PeriodeVariant
    ): keyof IPeriodeSkolepenger => {
        switch (periodeVariant) {
            case PeriodeVariant.ÅR_MÅNED_FRA:
                return 'årMånedFra';
            case PeriodeVariant.ÅR_MÅNED_TIL:
                return 'årMånedTil';
        }
    };

    return (
        <>
            <SkoleårsperiodeRad lesevisning={!behandlingErRedigerbar} erHeader>
                <Element>Studietype</Element>
                <Element>Periode fra og med</Element>
                <Element>Periode til og med</Element>
                <Element>Studiebelastning</Element>
            </SkoleårsperiodeRad>
            {data.map((periode, index) => {
                const { studietype, årMånedFra, årMånedTil, studiebelastning } = periode;
                const skalViseFjernKnapp =
                    behandlingErRedigerbar && index === data.length - 1 && index !== 0;

                return (
                    <>
                        <SkoleårsperiodeRad key={index} lesevisning={!behandlingErRedigerbar}>
                            <StyledSelect
                                aria-label="Periodetype"
                                value={studietype}
                                feil={valideringsfeil && valideringsfeil[index]?.studietype}
                                onChange={(e) => {
                                    oppdaterStudietype(e.target.value as ESkolepengerStudietype);
                                }}
                                erLesevisning={!behandlingErRedigerbar || index !== 0}
                                lesevisningVerdi={
                                    index === 0
                                        ? studietype && skolepengerStudietypeTilTekst[studietype]
                                        : ' '
                                }
                            >
                                <option value="">Velg</option>
                                {[ESkolepengerStudietype.HØGSKOLE_UNIVERSITET].map((type) => (
                                    <option value={type} key={type}>
                                        {skolepengerStudietypeTilTekst[type]}
                                    </option>
                                ))}
                            </StyledSelect>
                            <MånedÅrPeriode
                                årMånedFraInitiell={årMånedFra}
                                årMånedTilInitiell={årMånedTil}
                                index={index}
                                onEndre={(verdi, periodeVariant) => {
                                    oppdaterUtgiftsPeriode(
                                        index,
                                        periodeVariantTilUtgiftsperiodeProperty(periodeVariant),
                                        verdi
                                    );
                                }}
                                feilmelding={valideringsfeil && valideringsfeil[index]?.årMånedFra}
                                erLesevisning={!behandlingErRedigerbar}
                            />
                            <StyledInput
                                onKeyPress={tilHeltall}
                                type="number"
                                //feil={valideringsfeil && valideringsfeil[index]?.studiebelastning}
                                value={harTallverdi(studiebelastning) ? studiebelastning : ''}
                                formatValue={(k) => k + ' %'}
                                onChange={(e) => {
                                    oppdaterUtgiftsPeriode(
                                        index,
                                        'studiebelastning',
                                        tilTallverdi(e.target.value)
                                    );
                                }}
                                erLesevisning={!behandlingErRedigerbar}
                            />
                            {skalViseFjernKnapp && (
                                <FjernKnapp
                                    onClick={() => {
                                        oppdater([
                                            ...data.slice(0, index),
                                            ...data.slice(index + 1),
                                        ]);
                                        settValideringsFeil(
                                            (valideringsfeil || []).filter((_, i) => i !== index)
                                        );
                                    }}
                                    knappetekst="Fjern vedtaksperiode"
                                />
                            )}
                        </SkoleårsperiodeRad>
                    </>
                );
            })}
            <LeggTilKnapp
                onClick={() => oppdater([...data, tomSkoleårsperiode])}
                knappetekst="Legg til periode"
                hidden={!behandlingErRedigerbar}
            />
        </>
    );
};

const UtgiftsperioderForSkoleår: React.FC<ValideringsPropsMedOppdatering<SkolepengerUtgift>> = ({
    data,
    oppdater,
    behandlingErRedigerbar,
    valideringsfeil,
    settValideringsFeil,
}) => {
    const oppdaterUtgift = (
        index: number,
        property: keyof SkolepengerUtgift,
        value: string | number | undefined
    ) => {
        oppdater(
            data.map((periode, i) => (index === i ? { ...periode, [property]: value } : periode))
        );
    };

    return (
        <div style={{ marginLeft: '1rem' }}>
            <Utgiftsrad>
                <Element>Utbetalingsmåned</Element>
                <Element>Utgifter</Element>
                <Element>Stønad</Element>
            </Utgiftsrad>
            {data.map((utgift, index) => {
                const skalViseFjernKnapp =
                    behandlingErRedigerbar && index === data.length - 1 && index !== 0;
                return (
                    <Utgiftsrad key={index}>
                        <MånedÅrVelger
                            årMånedInitiell={utgift.årMånedFra}
                            //label={datoFraTekst}
                            onEndret={(verdi) => {
                                oppdaterUtgift(index, 'årMånedFra', verdi);
                            }}
                            antallÅrTilbake={10}
                            antallÅrFrem={4}
                            lesevisning={!behandlingErRedigerbar}
                            feilmelding={valideringsfeil && valideringsfeil[index]?.årMånedFra}
                        />
                        <StyledInputMedTusenSkille
                            onKeyPress={tilHeltall}
                            type="number"
                            value={harTallverdi(utgift.utgifter) ? utgift.utgifter : ''}
                            feil={valideringsfeil && valideringsfeil[index]?.utgifter}
                            onChange={(e) => {
                                oppdaterUtgift(index, 'utgifter', tilTallverdi(e.target.value));
                            }}
                            erLesevisning={!behandlingErRedigerbar}
                        />
                        <StyledInputMedTusenSkille
                            onKeyPress={tilHeltall}
                            type="number"
                            value={harTallverdi(utgift.stønad) ? utgift.stønad : ''}
                            feil={valideringsfeil && valideringsfeil[index]?.stønad}
                            onChange={(e) => {
                                oppdaterUtgift(index, 'stønad', tilTallverdi(e.target.value));
                            }}
                            erLesevisning={!behandlingErRedigerbar}
                        />
                        {skalViseFjernKnapp && (
                            <FjernKnapp
                                onClick={() => {
                                    oppdater([...data.slice(0, index), ...data.slice(index + 1)]);
                                    settValideringsFeil(
                                        (valideringsfeil || []).filter((_, i) => i !== index)
                                    );
                                }}
                                knappetekst="Fjern vedtaksperiode"
                            />
                        )}
                    </Utgiftsrad>
                );
            })}
            <LeggTilKnapp
                onClick={() => oppdater([...data, tomUtgift])}
                knappetekst="Legg til utgift"
                hidden={!behandlingErRedigerbar}
            />
        </div>
    );
};

export default Skoleårsperioder;
