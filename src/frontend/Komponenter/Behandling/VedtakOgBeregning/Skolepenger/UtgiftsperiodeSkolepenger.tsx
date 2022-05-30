import {
    ESkolepengerStudietype,
    EUtgiftsperiodeProperty,
    IUtgiftsperiodeSkolepenger,
    skolepengerStudietypeTilTekst,
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
import { VEDTAK_OG_BEREGNING } from '../Felles/konstanter';
import { useApp } from '../../../../App/context/AppContext';
import { harTallverdi, tilHeltall, tilTallverdi } from '../../../../App/utils/utils';
import InputMedTusenSkille from '../../../../Felles/Visningskomponenter/InputMedTusenskille';
import { InnvilgeVedtakForm } from './VedtaksformSkolepenger';
import { FamilieSelect } from '@navikt/familie-form-elements';
import InputUtenSpinner from '../../../../Felles/Visningskomponenter/InputUtenSpinner';

const UtgiftsperiodeRad = styled.div<{ lesevisning?: boolean; erHeader?: boolean }>`
    display: grid;
    grid-template-areas: 'studietype fraOgMedVelger tilOgMedVelger studiebelastning utgifter';
    grid-template-columns: ${(props) =>
        props.lesevisning ? '10rem 10rem 10rem 7rem 5rem' : '12rem 12rem 12rem 8rem 6rem 4rem'};
    grid-gap: ${(props) => (props.lesevisning ? '0.5rem' : '1rem')};
    margin-bottom: ${(props) => (props.erHeader ? '0,5rem' : 0)};
`;

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
    utgiftsperioder: ListState<IUtgiftsperiodeSkolepenger>;
    valideringsfeil?: FormErrors<InnvilgeVedtakForm>['utgiftsperioder'];
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
}

export const tomUtgiftsperiodeRad: IUtgiftsperiodeSkolepenger = {
    studietype: undefined,
    årMånedFra: '',
    årMånedTil: '',
    studiebelastning: undefined,
    utgifter: undefined,
};

const UtgiftsperiodeSkolepenger: React.FC<Props> = ({
    utgiftsperioder,
    valideringsfeil,
    settValideringsFeil,
}) => {
    const { behandlingErRedigerbar } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();

    const oppdaterUtgiftsPeriode = (
        index: number,
        property: keyof IUtgiftsperiodeSkolepenger,
        value: string | string[] | number | undefined
    ) => {
        utgiftsperioder.update(
            {
                ...utgiftsperioder.value[index],
                [property]: value,
            },
            index
        );
        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
    };

    const periodeVariantTilUtgiftsperiodeProperty = (
        periodeVariant: PeriodeVariant
    ): keyof IUtgiftsperiodeSkolepenger => {
        switch (periodeVariant) {
            case PeriodeVariant.ÅR_MÅNED_FRA:
                return 'årMånedFra';
            case PeriodeVariant.ÅR_MÅNED_TIL:
                return 'årMånedTil';
        }
    };

    return (
        <>
            <UtgiftsperiodeRad lesevisning={!behandlingErRedigerbar} erHeader>
                <Element>Studietype</Element>
                <Element>Periode fra og med</Element>
                <Element>Periode til og med</Element>
                <Element>Studiebelastning</Element>
                <Element>Utgifter</Element>
            </UtgiftsperiodeRad>
            {utgiftsperioder.value.map((utgiftsperiode, index) => {
                const { studietype, årMånedFra, årMånedTil, studiebelastning, utgifter } =
                    utgiftsperiode;
                const skalViseFjernKnapp =
                    behandlingErRedigerbar &&
                    index === utgiftsperioder.value.length - 1 &&
                    index !== 0;

                return (
                    <UtgiftsperiodeRad key={index} lesevisning={!behandlingErRedigerbar}>
                        <StyledSelect
                            aria-label="Periodetype"
                            value={studietype}
                            feil={valideringsfeil && valideringsfeil[index]?.studietype}
                            onChange={(e) => {
                                oppdaterUtgiftsPeriode(index, 'studietype', e.target.value);
                            }}
                            erLesevisning={!behandlingErRedigerbar}
                            lesevisningVerdi={
                                studietype && skolepengerStudietypeTilTekst[studietype]
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
                                settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
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
                            feil={valideringsfeil && valideringsfeil[index]?.studiebelastning}
                            value={harTallverdi(studiebelastning) ? studiebelastning : ''}
                            formatValue={(k) => k + ' %'}
                            onChange={(e) => {
                                settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                                oppdaterUtgiftsPeriode(
                                    index,
                                    'studiebelastning',
                                    tilTallverdi(e.target.value)
                                );
                            }}
                            erLesevisning={!behandlingErRedigerbar}
                        />
                        <StyledInputMedTusenSkille
                            onKeyPress={tilHeltall}
                            type="number"
                            value={harTallverdi(utgifter) ? utgifter : ''}
                            feil={valideringsfeil && valideringsfeil[index]?.utgifter}
                            onChange={(e) => {
                                settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                                oppdaterUtgiftsPeriode(
                                    index,
                                    EUtgiftsperiodeProperty.utgifter,
                                    tilTallverdi(e.target.value)
                                );
                            }}
                            erLesevisning={!behandlingErRedigerbar}
                        />
                        {skalViseFjernKnapp && (
                            <FjernKnapp
                                onClick={() => {
                                    utgiftsperioder.remove(index);
                                    settValideringsFeil(
                                        (prevState: FormErrors<InnvilgeVedtakForm>) => {
                                            const perioder = (
                                                prevState.utgiftsperioder ?? []
                                            ).filter((_, i) => i !== index);
                                            return { ...prevState, perioder };
                                        }
                                    );
                                }}
                                knappetekst="Fjern vedtaksperiode"
                            />
                        )}
                    </UtgiftsperiodeRad>
                );
            })}
            <LeggTilKnapp
                onClick={() => utgiftsperioder.push(tomUtgiftsperiodeRad)}
                knappetekst="Legg til vedtaksperiode"
                hidden={!behandlingErRedigerbar}
            />
        </>
    );
};

export default UtgiftsperiodeSkolepenger;
