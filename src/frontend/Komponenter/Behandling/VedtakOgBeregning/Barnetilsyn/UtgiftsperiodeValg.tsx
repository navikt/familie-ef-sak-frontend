import {
    EUtgiftsperiodeProperty,
    IUtgiftsperiode,
    periodeVariantTilProperty,
} from '../../../../App/typer/vedtak';
import MånedÅrPeriode from '../../../../Felles/Input/MånedÅr/MånedÅrPeriode';
import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import LeggTilKnapp from '../../../../Felles/Knapper/LeggTilKnapp';
import FjernKnapp from '../../../../Felles/Knapper/FjernKnapp';
import { ListState } from '../../../../App/hooks/felles/useListState';
import { Element } from 'nav-frontend-typografi';
import { FormErrors } from '../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './Vedtaksform';
import { VEDTAK_OG_BEREGNING } from '../konstanter';
import { useApp } from '../../../../App/context/AppContext';
import { FamilieReactSelect, ISelectOption } from '@navikt/familie-form-elements';
import { harTallverdi, tilTallverdi } from '../../../../App/utils/utils';
import InputMedTusenSkille from '../../../../Felles/Visningskomponenter/InputMedTusenskille';
import { Stønadstype } from '../../../../App/typer/behandlingstema';
import { barnFormatertForBarnVelger, mapValgtBarnTilNavn } from './mockData';

const UtgiftsperiodeContainer = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-areas: 'fraOgMedVelger tilOgMedVelger fraOgMedVelger barnVelger antallBarn utgifter slettknapp';
    grid-template-columns: ${(props) =>
        props.lesevisning ? '8rem 10rem 7rem 7rem 7rem' : '12rem 12rem 25rem 2rem 4rem 4rem'};
    grid-gap: ${(props) => (props.lesevisning ? '0.5rem' : '1rem')};
`;

const KolonneHeaderWrapper = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-areas: 'fraOgMedVelger tilOgMedVelger fraOgMedVelger barnVelger antallBarn utgifter';
    grid-template-columns: ${(props) =>
        props.lesevisning ? '8rem 10rem 7rem 7rem 7rem' : '12rem 12rem 25rem 2rem 4rem'};
    grid-gap: ${(props) => (props.lesevisning ? '0.5rem' : '1rem')};
    margin-bottom: 0.5rem;
`;

const StyledInput = styled(InputMedTusenSkille)`
    text-align: left;
`;

interface Props {
    utgiftsperioder: ListState<IUtgiftsperiode>;
    valideringsfeil?: FormErrors<InnvilgeVedtakForm>['utgiftsperioder'];
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
}

export const tomUtgiftsperiodeRad: IUtgiftsperiode = {
    årMånedFra: '',
    årMånedTil: '',
    barn: [],
    utgifter: undefined,
};

const UtgiftsperiodeValg: React.FC<Props> = ({
    utgiftsperioder,
    valideringsfeil,
    settValideringsFeil,
}) => {
    const { behandlingErRedigerbar } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();

    const oppdaterUtgiftsPeriode = (
        index: number,
        property: EUtgiftsperiodeProperty,
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

    return (
        <>
            <KolonneHeaderWrapper lesevisning={!behandlingErRedigerbar}>
                <Element>Periode fra og med</Element>
                <Element>Periode til og med</Element>
                <Element>Velg barn</Element>
                <Element>Ant.</Element>
                <Element>Utgifter</Element>
            </KolonneHeaderWrapper>
            {utgiftsperioder.value.map((utgiftsperiode, index) => {
                const { årMånedFra, årMånedTil, utgifter } = utgiftsperiode;
                const skalViseFjernKnapp =
                    behandlingErRedigerbar &&
                    index === utgiftsperioder.value.length - 1 &&
                    index !== 0;

                return (
                    <UtgiftsperiodeContainer key={index} lesevisning={!behandlingErRedigerbar}>
                        <MånedÅrPeriode
                            årMånedFraInitiell={årMånedFra}
                            årMånedTilInitiell={årMånedTil}
                            index={index}
                            onEndre={(verdi, periodeVariant) => {
                                settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                                oppdaterUtgiftsPeriode(
                                    index,
                                    periodeVariantTilProperty(
                                        periodeVariant,
                                        Stønadstype.BARNETILSYN
                                    ) as EUtgiftsperiodeProperty,
                                    verdi
                                );
                            }}
                            feilmelding={valideringsfeil && valideringsfeil[index]?.årMånedFra}
                            erLesevisning={!behandlingErRedigerbar}
                        />
                        {/* @ts-ignore:next-line */}
                        <FamilieReactSelect
                            placeholder={'Velg barn'}
                            options={barnFormatertForBarnVelger}
                            creatable={false}
                            isMulti={true}
                            onChange={(valgtBarn) => {
                                settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                                oppdaterUtgiftsPeriode(
                                    index,
                                    EUtgiftsperiodeProperty.barn,
                                    valgtBarn === null
                                        ? []
                                        : [...mapValgtBarnTilNavn(valgtBarn as ISelectOption[])]
                                );
                            }}
                        />
                        <Element style={{ marginTop: behandlingErRedigerbar ? '0.65rem' : 0 }}>{`${
                            utgiftsperioder.value[index].barn
                                ? utgiftsperioder.value[index].barn?.length
                                : 0
                        }`}</Element>
                        <StyledInput
                            type="number"
                            value={harTallverdi(utgifter) ? utgifter : ''}
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
                    </UtgiftsperiodeContainer>
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

export default UtgiftsperiodeValg;
