import { EUtgiftsperiodeProperty, IUtgiftsperiode } from '../../../../App/typer/vedtak';
import MånedÅrPeriode, { PeriodeVariant } from '../../../../Felles/Input/MånedÅr/MånedÅrPeriode';
import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import LeggTilKnapp from '../../../../Felles/Knapper/LeggTilKnapp';
import { ListState } from '../../../../App/hooks/felles/useListState';
import { FormErrors } from '../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './Vedtaksform';
import { VEDTAK_OG_BEREGNING } from '../Felles/konstanter';
import { useApp } from '../../../../App/context/AppContext';
import { FamilieCheckbox, FamilieReactSelect, ISelectOption } from '@navikt/familie-form-elements';
import { harTallverdi, tilHeltall, tilTallverdi } from '../../../../App/utils/utils';
import InputMedTusenSkille from '../../../../Felles/Visningskomponenter/InputMedTusenskille';
import { IBarnMedSamvær } from '../../Inngangsvilkår/Aleneomsorg/typer';
import { datoTilAlder } from '../../../../App/utils/dato';
import { Label, Tooltip } from '@navikt/ds-react';
import FjernKnapp from '../../../../Felles/Knapper/FjernKnapp';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import { tomUtgiftsperiodeRad } from './utils';

const UtgiftsperiodeRad = styled.div<{ lesevisning?: boolean; erHeader?: boolean }>`
    display: grid;
    grid-template-areas: 'fraOgMedVelger tilOgMedVelger fraOgMedVelger barnVelger antallBarn utgifter checkbox slettknapp leggTilKnapp';
    grid-template-columns: ${(props) =>
        props.lesevisning
            ? '10rem 10rem 18rem 2rem 4rem 4rem'
            : '14rem 14rem 25rem 2rem 4rem 2rem 4rem 3rem'};
    grid-gap: ${(props) => (props.lesevisning ? '0.5rem' : '1rem')};
    padding-bottom: ${(props) => (props.erHeader ? '0.5rem' : 0)};
`;

const AntallBarn = styled(BodyShortSmall)<{ lesevisning: boolean }>`
    margin-top: ${(props) => (props.lesevisning ? '0.65rem' : '0rem')};
    text-align: center;
`;

const StyledInput = styled(InputMedTusenSkille)`
    text-align: left;
`;

const ContainerMedLuftUnder = styled.div`
    margin-bottom: 1rem;
`;

const TekstEnLinje = styled(Label)`
    white-space: nowrap;
`;

const CheckboxContainer = styled.div`
    bottom: 0.5rem;
`;

const TekstIngenStønad = styled(BodyShortSmall)`
    margin-top: 0.5rem;
`;

interface Props {
    utgiftsperioder: ListState<IUtgiftsperiode>;
    valideringsfeil?: FormErrors<InnvilgeVedtakForm>['utgiftsperioder'];
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
    barn: IBarnMedSamvær[];
}

const UtgiftsperiodeValg: React.FC<Props> = ({
    utgiftsperioder,
    valideringsfeil,
    settValideringsFeil,
    barn,
}) => {
    const { behandlingErRedigerbar } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();

    const oppdaterUtgiftsperiode = (
        index: number,
        property: EUtgiftsperiodeProperty,
        value: string | string[] | number | boolean | undefined
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

    const leggTilTomRadUnder = (index: number) => {
        utgiftsperioder.setValue((prevState) => [
            ...prevState.slice(0, index + 1),
            tomUtgiftsperiodeRad(),
            ...prevState.slice(index + 1, prevState.length),
        ]);
    };

    const oppdaterUtgiftsperiodeDersomMidlertidigOpphør = (
        index: number,
        erMidlertidigOpphør: boolean
    ) => {
        if (erMidlertidigOpphør) {
            utgiftsperioder.update(
                {
                    ...utgiftsperioder.value[index],
                    [EUtgiftsperiodeProperty.erMidlertidigOpphør]: erMidlertidigOpphør,
                    [EUtgiftsperiodeProperty.barn]: [],
                    [EUtgiftsperiodeProperty.utgifter]: 0,
                },
                index
            );
        } else {
            oppdaterUtgiftsperiode(
                index,
                EUtgiftsperiodeProperty.erMidlertidigOpphør,
                erMidlertidigOpphør
            );
            settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
        }
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
            <UtgiftsperiodeRad lesevisning={!behandlingErRedigerbar} erHeader>
                <Label>Periode fra og med</Label>
                <Label>Periode til og med</Label>
                <Label>Velg barn</Label>
                <Label>Ant.</Label>
                <Label>Utgifter</Label>
                <TekstEnLinje>Ingen stønad/opphør</TekstEnLinje>
            </UtgiftsperiodeRad>
            {utgiftsperioder.value.map((utgiftsperiode, index) => {
                const { årMånedFra, årMånedTil, utgifter, erMidlertidigOpphør } = utgiftsperiode;
                const skalViseFjernKnapp = behandlingErRedigerbar && index !== 0;

                const barnForPeriode = barnFormatertForBarnVelger(barn);
                const ikkeValgteBarn = barnForPeriode.filter((barn) =>
                    utgiftsperiode.barn.includes(barn.value)
                );
                return (
                    <UtgiftsperiodeRad
                        key={utgiftsperiode.endretKey}
                        lesevisning={!behandlingErRedigerbar}
                    >
                        <MånedÅrPeriode
                            årMånedFraInitiell={årMånedFra}
                            årMånedTilInitiell={årMånedTil}
                            index={index}
                            onEndre={(verdi, periodeVariant) => {
                                oppdaterUtgiftsperiode(
                                    index,
                                    periodeVariantTilUtgiftsperiodeProperty(periodeVariant),
                                    verdi
                                );
                            }}
                            feilmelding={valideringsfeil && valideringsfeil[index]?.årMånedFra}
                            erLesevisning={!behandlingErRedigerbar}
                        />
                        {behandlingErRedigerbar ? (
                            <FamilieReactSelect
                                placeholder={'Velg barn'}
                                label={''}
                                options={barnForPeriode}
                                creatable={false}
                                isMulti={true}
                                isDisabled={erMidlertidigOpphør}
                                defaultValue={ikkeValgteBarn}
                                value={erMidlertidigOpphør ? [] : ikkeValgteBarn}
                                feil={valideringsfeil && valideringsfeil[index]?.barn[0]}
                                onChange={(valgtBarn) => {
                                    oppdaterUtgiftsperiode(
                                        index,
                                        EUtgiftsperiodeProperty.barn,
                                        valgtBarn === null
                                            ? []
                                            : [...mapValgtBarn(valgtBarn as ISelectOption[])]
                                    );
                                }}
                            />
                        ) : (
                            <ContainerMedLuftUnder>
                                {barnForPeriode
                                    .filter((barn) => utgiftsperiode.barn.includes(barn.value))
                                    .map((barn) => (
                                        <BodyShortSmall>{barn.label}</BodyShortSmall>
                                    ))}
                            </ContainerMedLuftUnder>
                        )}
                        <AntallBarn lesevisning={behandlingErRedigerbar}>{`${
                            utgiftsperioder.value[index].barn
                                ? utgiftsperioder.value[index].barn?.length
                                : 0
                        }`}</AntallBarn>
                        <StyledInput
                            onKeyPress={tilHeltall}
                            type="number"
                            size={'small'}
                            value={harTallverdi(utgifter) ? utgifter : ''}
                            disabled={erMidlertidigOpphør}
                            onChange={(e) => {
                                oppdaterUtgiftsperiode(
                                    index,
                                    EUtgiftsperiodeProperty.utgifter,
                                    tilTallverdi(e.target.value)
                                );
                            }}
                            erLesevisning={!behandlingErRedigerbar}
                            label={'Utgifter'}
                            hideLabel
                        />
                        <CheckboxContainer>
                            {!behandlingErRedigerbar && erMidlertidigOpphør ? (
                                <TekstIngenStønad>Ja</TekstIngenStønad>
                            ) : (
                                <FamilieCheckbox
                                    erLesevisning={!behandlingErRedigerbar}
                                    checked={erMidlertidigOpphør}
                                    onChange={() => {
                                        oppdaterUtgiftsperiodeDersomMidlertidigOpphør(
                                            index,
                                            !erMidlertidigOpphør
                                        );
                                    }}
                                    children={null}
                                />
                            )}
                        </CheckboxContainer>
                        {skalViseFjernKnapp ? (
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
                                ikontekst={'Fjern utgiftsperiode'}
                            />
                        ) : (
                            <div />
                        )}
                        {behandlingErRedigerbar && (
                            <Tooltip content="Legg til rad under" placement="right">
                                <LeggTilKnapp
                                    onClick={() => leggTilTomRadUnder(index)}
                                    ikontekst={'Legg til ny rad'}
                                />
                            </Tooltip>
                        )}
                    </UtgiftsperiodeRad>
                );
            })}
            <ContainerMedLuftUnder>
                {behandlingErRedigerbar && (
                    <LeggTilKnapp
                        onClick={() => utgiftsperioder.push(tomUtgiftsperiodeRad())}
                        knappetekst="Legg til vedtaksperiode"
                    />
                )}
            </ContainerMedLuftUnder>
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

const mapValgtBarn = (valgtBarn: ISelectOption[]): string[] => {
    return valgtBarn.map((barn) => barn.value);
};

export default UtgiftsperiodeValg;
