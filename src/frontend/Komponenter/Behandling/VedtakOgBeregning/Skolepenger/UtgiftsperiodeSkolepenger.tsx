import {
    ESkolepengerStudietype,
    IUtgiftsperiodeSkolepenger,
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
import { VEDTAK_OG_BEREGNING } from '../Felles/konstanter';
import { useApp } from '../../../../App/context/AppContext';
import { harTallverdi, tilHeltall, tilTallverdi } from '../../../../App/utils/utils';
import InputMedTusenSkille from '../../../../Felles/Visningskomponenter/InputMedTusenskille';
import { InnvilgeVedtakForm } from './VedtaksformSkolepenger';
import { FamilieSelect } from '@navikt/familie-form-elements';
import InputUtenSpinner from '../../../../Felles/Visningskomponenter/InputUtenSpinner';
import MånedÅrVelger from '../../../../Felles/Input/MånedÅr/MånedÅrVelger';

const UtgiftsperiodeRad = styled.div<{ lesevisning?: boolean; erHeader?: boolean }>`
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
    utgifter: [],
};

export const tomUtgift: SkolepengerUtgift = {
    årMånedFra: '',
    utgifter: undefined,
    stønad: undefined,
};

const UtgiftsperioderForSkoleår: React.FC<{
    utgifter: SkolepengerUtgift[];
    oppdaterUtgiftsperioder: (utgifter: SkolepengerUtgift[]) => void;
    valideringsfeil?: FormErrors<SkolepengerUtgift[]>;
    behandlingErRedigerbar: boolean;
}> = ({ utgifter, oppdaterUtgiftsperioder, valideringsfeil, behandlingErRedigerbar }) => {
    const oppdaterUtgift = (
        utgiftsindexSomSkalOppdateres: number,
        property: keyof SkolepengerUtgift,
        value: string | number | undefined
    ) => {
        const perioder = utgifter.map((utgift, utgiftsindex) => {
            if (utgiftsindex === utgiftsindexSomSkalOppdateres) {
                return { ...utgift, [property]: value };
            } else {
                return utgift;
            }
        });
        oppdaterUtgiftsperioder(perioder);
    };

    return (
        <div style={{ marginLeft: '1rem' }}>
            <Utgiftsrad>
                <Element>Utbetalingsmåned</Element>
                <Element>Utgifter</Element>
                <Element>Stønad</Element>
            </Utgiftsrad>
            {utgifter.map((utgift, index) => {
                const skalViseFjernKnappUtgift =
                    behandlingErRedigerbar && index === utgifter.length - 1 && index !== 0;
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
                        {skalViseFjernKnappUtgift && (
                            <FjernKnapp
                                onClick={() => {
                                    oppdaterUtgiftsperioder([
                                        ...utgifter.slice(0, index),
                                        ...utgifter.slice(index + 1),
                                    ]);
                                    /*settValideringsFeil(
                                (prevState: FormErrors<InnvilgeVedtakForm>) => {
                                    const perioder = (
                                        prevState.utgiftsperioder ?? []
                                    ).filter((_, i) => i !== index);
                                    return { ...prevState, perioder };
                                }
                            );*/
                                }}
                                knappetekst="Fjern vedtaksperiode"
                            />
                        )}
                    </Utgiftsrad>
                );
            })}
        </div>
    );
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
        value: string | SkolepengerUtgift[] | number | undefined
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
            </UtgiftsperiodeRad>
            {utgiftsperioder.value.map((utgiftsperiode, index) => {
                const { studietype, årMånedFra, årMånedTil, studiebelastning } = utgiftsperiode;
                const skalViseFjernKnapp =
                    behandlingErRedigerbar &&
                    index === utgiftsperioder.value.length - 1 &&
                    index !== 0;

                return (
                    <>
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
                        <UtgiftsperioderForSkoleår
                            utgifter={utgiftsperioder.value[index].utgifter}
                            oppdaterUtgiftsperioder={(utgifter) =>
                                oppdaterUtgiftsPeriode(index, 'utgifter', utgifter)
                            }
                            valideringsfeil={valideringsfeil && valideringsfeil[index]?.utgifter}
                            behandlingErRedigerbar={behandlingErRedigerbar}
                        />
                        <LeggTilKnapp
                            onClick={() =>
                                utgiftsperioder.update(
                                    {
                                        ...utgiftsperioder.value[index],
                                        utgifter: [
                                            ...utgiftsperioder.value[index].utgifter,
                                            tomUtgift,
                                        ],
                                    },
                                    index
                                )
                            }
                            knappetekst="Legg til periode"
                            hidden={!behandlingErRedigerbar}
                        />
                    </>
                );
            })}
            <div>
                <LeggTilKnapp
                    onClick={() => utgiftsperioder.push(tomUtgiftsperiodeRad)}
                    knappetekst="Legg til skoleår"
                    hidden={!behandlingErRedigerbar}
                />
            </div>
        </>
    );
};

export default UtgiftsperiodeSkolepenger;
