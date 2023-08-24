import {
    EUtgiftsperiodeProperty,
    EUtgiftsperiodetype,
    IUtgiftsperiode,
} from '../../../../../App/typer/vedtak';
import MånedÅrPeriode, { PeriodeVariant } from '../../../../../Felles/Input/MånedÅr/MånedÅrPeriode';
import React, { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import LeggTilKnapp from '../../../../../Felles/Knapper/LeggTilKnapp';
import { ListState } from '../../../../../App/hooks/felles/useListState';
import { FormErrors } from '../../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './InnvilgeBarnetilsyn';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import { useApp } from '../../../../../App/context/AppContext';
import { FamilieReactSelect, ISelectOption } from '@navikt/familie-form-elements';
import { harTallverdi, tilHeltall, tilTallverdi } from '../../../../../App/utils/utils';
import InputMedTusenSkille from '../../../../../Felles/Visningskomponenter/InputMedTusenskille';
import { IBarnMedSamvær } from '../../../Inngangsvilkår/Aleneomsorg/typer';
import { datoTilAlder } from '../../../../../App/utils/dato';
import { Heading, Label, Tooltip } from '@navikt/ds-react';
import FjernKnapp from '../../../../../Felles/Knapper/FjernKnapp';
import { BodyShortSmall } from '../../../../../Felles/Visningskomponenter/Tekster';
import { erOpphørEllerSanksjon, tomUtgiftsperiodeRad } from '../Felles/utils';
import PeriodetypeSelect from './PeriodetypeSelect';
import AktivitetSelect from './AktivitetSelect';
import {
    Sanksjonsmodal,
    SlettSanksjonsperiodeModal,
} from '../../Felles/SlettSanksjonsperiodeModal';
import { HorizontalScroll } from '../../Felles/HorizontalScroll';
import { FieldState } from '../../../../../App/hooks/felles/useFieldState';
import { IngenBegrunnelseOppgitt } from '../../Overgangsstønad/InnvilgeVedtak/IngenBegrunnelseOppgitt';
import { EnsligTextArea } from '../../../../../Felles/Input/TekstInput/EnsligTextArea';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';

const Container = styled.div`
    padding: 1rem;
    background-color: ${AGray50};
`;

const Grid = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-columns: ${(props) =>
        props.lesevisning
            ? 'repeat(7, max-content)'
            : '9rem 9rem repeat(2, max-content) 20rem 2rem 4rem repeat(2, max-content)'};
    grid-gap: 0.5rem 1rem;
    margin-bottom: 0.5rem;
    align-items: start;

    .ny-rad {
        grid-column: 1;
    }
`;

const SentrertBodySort = styled(BodyShortSmall)`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 0.75rem;
`;

const BarnVelger = styled(FamilieReactSelect)`
    margin-bottom: -1rem;
`;

const MarginBottomDiv = styled.div`
    margin-bottom: 1rem;
`;

const TextArea = styled(EnsligTextArea)`
    margin-top: 0.5rem;
`;

interface Props {
    begrunnelseState: FieldState;
    errorState: FormErrors<InnvilgeVedtakForm>;
    utgiftsperioderState: ListState<IUtgiftsperiode>;
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
    barn: IBarnMedSamvær[];
    låsFraDatoFørsteRad: boolean;
}

const UtgiftsperiodeValg: React.FC<Props> = ({
    begrunnelseState,
    errorState,
    utgiftsperioderState,
    settValideringsFeil,
    barn,
    låsFraDatoFørsteRad,
}) => {
    const { behandlingErRedigerbar, åpenHøyremeny } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();
    const [sanksjonsmodal, settSanksjonsmodal] = useState<Sanksjonsmodal>({
        visModal: false,
    });

    const oppdaterUtgiftsperiode = (
        index: number,
        property: EUtgiftsperiodeProperty,
        value: string | string[] | number | boolean | undefined
    ) => {
        if (
            property === EUtgiftsperiodeProperty.periodetype &&
            (value === EUtgiftsperiodetype.OPPHØR || value === EUtgiftsperiodetype.SANKSJON_1_MND)
        ) {
            oppdaterUtgiftsperiodeDersomMidlertidigOpphør(index);
        } else {
            utgiftsperioderState.update(
                {
                    ...utgiftsperioderState.value[index],
                    [property]: value,
                },
                index
            );
        }
        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
    };

    const leggTilTomRadUnder = (index: number) => {
        utgiftsperioderState.setValue((prevState) => [
            ...prevState.slice(0, index + 1),
            tomUtgiftsperiodeRad(),
            ...prevState.slice(index + 1, prevState.length),
        ]);
    };

    const oppdaterUtgiftsperiodeDersomMidlertidigOpphør = (index: number) => {
        utgiftsperioderState.update(
            {
                ...utgiftsperioderState.value[index],
                [EUtgiftsperiodeProperty.periodetype]: EUtgiftsperiodetype.OPPHØR,
                [EUtgiftsperiodeProperty.aktivitetstype]: undefined,
                [EUtgiftsperiodeProperty.barn]: [],
                [EUtgiftsperiodeProperty.utgifter]: 0,
            },
            index
        );
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

    const lukkSanksjonsmodal = () => {
        settSanksjonsmodal({ visModal: false });
    };

    const slettPeriode = (index: number) => {
        if (sanksjonsmodal.visModal) {
            lukkSanksjonsmodal();
        }
        utgiftsperioderState.remove(index);
        settValideringsFeil((prevState: FormErrors<InnvilgeVedtakForm>) => {
            const utgiftsperioder = (prevState.utgiftsperioder ?? []).filter((_, i) => i !== index);
            return { ...prevState, utgiftsperioder };
        });
    };

    const slettPeriodeModalHvisSanksjon = (index: number) => {
        const periode = utgiftsperioderState.value[index];
        if (periode.periodetype === EUtgiftsperiodetype.SANKSJON_1_MND) {
            settSanksjonsmodal({
                visModal: true,
                index: index,
                årMånedFra: periode.årMånedFra,
            });
        } else {
            slettPeriode(index);
        }
    };

    return (
        <Container>
            <HorizontalScroll
                synligVedLukketMeny={'1460px'}
                synligVedÅpenMeny={'1765px'}
                åpenHøyremeny={åpenHøyremeny}
            >
                <Heading spacing size="small" level="5">
                    Utgifter til barnetilsyn
                </Heading>
                <Grid lesevisning={!behandlingErRedigerbar}>
                    <Label>Periodetype</Label>
                    <Label>Aktivitet</Label>
                    <Label>Periode fra og med</Label>
                    <Label>Periode til og med</Label>
                    <Label>Velg barn</Label>
                    <Label>Ant.</Label>
                    <Label>Utgifter</Label>
                    {utgiftsperioderState.value.map((utgiftsperiode, index) => {
                        const { periodetype, aktivitetstype, årMånedFra, årMånedTil, utgifter } =
                            utgiftsperiode;
                        const skalViseFjernKnapp = behandlingErRedigerbar && index !== 0;
                        const barnForPeriode = barnFormatertForBarnVelger(barn);
                        const ikkeValgteBarn = barnForPeriode.filter((barn) =>
                            utgiftsperiode.barn.includes(barn.value)
                        );
                        const opphørEllerSanksjon = erOpphørEllerSanksjon(periodetype);
                        const antallBarn = utgiftsperioderState.value[index].barn
                            ? utgiftsperioderState.value[index].barn?.length
                            : 0;
                        return (
                            <React.Fragment key={utgiftsperiode.endretKey}>
                                <PeriodetypeSelect
                                    className={'ny-rad'}
                                    periodetype={periodetype}
                                    oppdaterUtgiftsperiodeElement={(property, value) =>
                                        oppdaterUtgiftsperiode(index, property, value)
                                    }
                                    lesevisning={!behandlingErRedigerbar}
                                    feil={
                                        errorState.utgiftsperioder &&
                                        errorState.utgiftsperioder[index]?.periodetype
                                    }
                                />
                                <AktivitetSelect
                                    periodetype={periodetype}
                                    aktivitet={aktivitetstype}
                                    oppdaterUtgiftsperiodeElement={(property, value) =>
                                        oppdaterUtgiftsperiode(index, property, value)
                                    }
                                    erLesevisning={!behandlingErRedigerbar}
                                    feil={
                                        errorState.utgiftsperioder &&
                                        errorState.utgiftsperioder[index]?.aktivitetstype
                                    }
                                />
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
                                    feilmelding={
                                        errorState.utgiftsperioder &&
                                        errorState.utgiftsperioder[index]?.årMånedFra
                                    }
                                    erLesevisning={
                                        !behandlingErRedigerbar ||
                                        periodetype === EUtgiftsperiodetype.SANKSJON_1_MND
                                    }
                                    disabledFra={index === 0 && låsFraDatoFørsteRad}
                                />
                                {behandlingErRedigerbar && !opphørEllerSanksjon ? (
                                    <BarnVelger
                                        placeholder={'Velg barn'}
                                        label={''}
                                        options={barnForPeriode}
                                        creatable={false}
                                        menuPortalTarget={document.querySelector('body')}
                                        isMulti={true}
                                        isDisabled={opphørEllerSanksjon}
                                        defaultValue={ikkeValgteBarn}
                                        value={opphørEllerSanksjon ? [] : ikkeValgteBarn}
                                        feil={
                                            errorState.utgiftsperioder &&
                                            errorState.utgiftsperioder[index]?.barn[0]
                                        }
                                        onChange={(valgtBarn) => {
                                            oppdaterUtgiftsperiode(
                                                index,
                                                EUtgiftsperiodeProperty.barn,
                                                valgtBarn === null
                                                    ? []
                                                    : [
                                                          ...mapValgtBarn(
                                                              valgtBarn as ISelectOption[]
                                                          ),
                                                      ]
                                            );
                                        }}
                                    />
                                ) : (
                                    <MarginBottomDiv>
                                        {barnForPeriode
                                            .filter((barn) =>
                                                utgiftsperiode.barn.includes(barn.value)
                                            )
                                            .map((barn) => (
                                                <BodyShortSmall key={barn.value}>
                                                    {barn.label}
                                                </BodyShortSmall>
                                            ))}
                                    </MarginBottomDiv>
                                )}
                                {opphørEllerSanksjon ? (
                                    <div />
                                ) : (
                                    <SentrertBodySort>{antallBarn}</SentrertBodySort>
                                )}
                                {opphørEllerSanksjon ? (
                                    <div />
                                ) : (
                                    <InputMedTusenSkille
                                        onKeyPress={tilHeltall}
                                        type="number"
                                        size={'small'}
                                        value={harTallverdi(utgifter) ? utgifter : ''}
                                        error={
                                            errorState.utgiftsperioder &&
                                            errorState.utgiftsperioder[index]?.utgifter
                                        }
                                        disabled={opphørEllerSanksjon}
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
                                )}
                                {behandlingErRedigerbar && (
                                    <Tooltip content="Legg til rad under" placement="right">
                                        <LeggTilKnapp
                                            onClick={() => leggTilTomRadUnder(index)}
                                            ikontekst={'Legg til ny rad'}
                                            variant="tertiary"
                                        />
                                    </Tooltip>
                                )}
                                {skalViseFjernKnapp ? (
                                    <FjernKnapp
                                        onClick={() => slettPeriodeModalHvisSanksjon(index)}
                                        ikontekst={'Fjern utgiftsperiode'}
                                    />
                                ) : (
                                    <div />
                                )}
                            </React.Fragment>
                        );
                    })}
                </Grid>
                {behandlingErRedigerbar && (
                    <LeggTilKnapp
                        onClick={() => utgiftsperioderState.push(tomUtgiftsperiodeRad())}
                        knappetekst="Legg til vedtaksperiode"
                    />
                )}
                <SlettSanksjonsperiodeModal
                    sanksjonsmodal={sanksjonsmodal}
                    slettPeriode={slettPeriode}
                    lukkModal={lukkSanksjonsmodal}
                />
            </HorizontalScroll>
            {!behandlingErRedigerbar && begrunnelseState.value === '' ? (
                <IngenBegrunnelseOppgitt />
            ) : (
                <TextArea
                    erLesevisning={!behandlingErRedigerbar}
                    value={begrunnelseState.value}
                    onChange={(event) => {
                        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                        begrunnelseState.onChange(event);
                    }}
                    label={'Begrunnelse for vedtaksperiode'}
                    maxLength={0}
                    feilmelding={errorState.begrunnelse}
                />
            )}
        </Container>
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
