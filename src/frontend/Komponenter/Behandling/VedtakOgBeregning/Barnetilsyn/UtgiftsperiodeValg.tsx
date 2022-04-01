import { EUtgiftsperiodeProperty, IUtgiftsperiode } from '../../../../App/typer/vedtak';
import MånedÅrPeriode, { PeriodeVariant } from '../../../../Felles/Input/MånedÅr/MånedÅrPeriode';
import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import LeggTilKnapp from '../../../../Felles/Knapper/LeggTilKnapp';
import FjernKnapp from '../../../../Felles/Knapper/FjernKnapp';
import { ListState } from '../../../../App/hooks/felles/useListState';
import { Element } from 'nav-frontend-typografi';
import { FormErrors } from '../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './Vedtaksform';
import { VEDTAK_OG_BEREGNING } from '../Felles/konstanter';
import { useApp } from '../../../../App/context/AppContext';
import { FamilieReactSelect, ISelectOption } from '@navikt/familie-form-elements';
import { harTallverdi, tilTallverdi } from '../../../../App/utils/utils';
import InputMedTusenSkille from '../../../../Felles/Visningskomponenter/InputMedTusenskille';
import { IBarnMedSamvær } from '../../Inngangsvilkår/Aleneomsorg/typer';
import { datoTilAlder } from '../../../../App/utils/dato';

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

const AntallBarn = styled(Element)<{ lesevisning: boolean }>`
    margin-top: ${(props) => (props.lesevisning ? '0.65rem' : '0rem')};
    text-align: center;
`;

const StyledInput = styled(InputMedTusenSkille)`
    text-align: left;
`;

interface Props {
    utgiftsperioder: ListState<IUtgiftsperiode>;
    valideringsfeil?: FormErrors<InnvilgeVedtakForm>['utgiftsperioder'];
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
    barn: IBarnMedSamvær[];
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
    barn,
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

    const periodeVariantTilUtgiftsperiodeProperty = (
        periodeVariant: PeriodeVariant
    ): EUtgiftsperiodeProperty => {
        switch (periodeVariant) {
            case PeriodeVariant.ÅR_MÅNED_FRA:
                return EUtgiftsperiodeProperty.årMånedFra;
            case PeriodeVariant.ÅR_MÅNED_TIL:
                return EUtgiftsperiodeProperty.årMånedTil;
        }
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
                                    periodeVariantTilUtgiftsperiodeProperty(periodeVariant),
                                    verdi
                                );
                            }}
                            feilmelding={valideringsfeil && valideringsfeil[index]?.årMånedFra}
                            erLesevisning={!behandlingErRedigerbar}
                        />
                        {/* @ts-ignore:next-line */}
                        <FamilieReactSelect
                            placeholder={'Velg barn'}
                            options={barnFormatertForBarnVelger(barn)}
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
                        <AntallBarn lesevisning={behandlingErRedigerbar}>{`${
                            utgiftsperioder.value[index].barn
                                ? utgiftsperioder.value[index].barn?.length
                                : 0
                        }`}</AntallBarn>
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

const barnFormatertForBarnVelger = (barn: IBarnMedSamvær[]) =>
    barn.map<ISelectOption>((barn) => {
        const alder = barn.registergrunnlag.fødselsdato
            ? datoTilAlder(barn.registergrunnlag.fødselsdato)
            : '';

        return {
            value: barn.barnId,
            label: `${barn.registergrunnlag.navn} (${alder}år)`,
        };
    });

const mapValgtBarnTilNavn = (valgtBarn: ISelectOption[]): string[] => {
    return valgtBarn.map((barn) => barn.label.split(' ')[0]);
};

export default UtgiftsperiodeValg;
