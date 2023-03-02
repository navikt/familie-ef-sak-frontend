import {
    EUtgiftsperiodeProperty,
    EUtgiftsperiodetype,
    IUtgiftsperiode,
} from '../../../../App/typer/vedtak';
import MånedÅrPeriode, { PeriodeVariant } from '../../../../Felles/Input/MånedÅr/MånedÅrPeriode';
import React, { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../App/context/BehandlingContext';
import LeggTilKnapp from '../../../../Felles/Knapper/LeggTilKnapp';
import { ListState } from '../../../../App/hooks/felles/useListState';
import { FormErrors } from '../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './Vedtaksform';
import { VEDTAK_OG_BEREGNING } from '../Felles/konstanter';
import { useApp } from '../../../../App/context/AppContext';
import { FamilieReactSelect, ISelectOption } from '@navikt/familie-form-elements';
import { harTallverdi, tilHeltall, tilTallverdi } from '../../../../App/utils/utils';
import InputMedTusenSkille from '../../../../Felles/Visningskomponenter/InputMedTusenskille';
import { IBarnMedSamvær } from '../../Inngangsvilkår/Aleneomsorg/typer';
import { datoTilAlder } from '../../../../App/utils/dato';
import { Label, Tooltip } from '@navikt/ds-react';
import FjernKnapp from '../../../../Felles/Knapper/FjernKnapp';
import { BodyShortSmall } from '../../../../Felles/Visningskomponenter/Tekster';
import { erOpphørEllerSanksjon, tomUtgiftsperiodeRad } from './utils';
import PeriodetypeSelect from './PeriodetypeSelect';
import AktivitetSelect from './AktivitetSelect';
import { Sanksjonsmodal, SlettSanksjonsperiodeModal } from '../Felles/SlettSanksjonsperiodeModal';
import { HorizontalScroll } from '../Felles/HorizontalScroll';

const UtgiftsperiodeRad = styled.div<{ lesevisning?: boolean; erHeader?: boolean }>`
    display: grid;
    grid-template-columns: ${(props) =>
        props.lesevisning
            ? '8rem 8rem 10rem 10rem 12rem 4rem 4rem'
            : '10rem 10rem 12.5rem 12.5rem 25rem 2rem 4rem 3rem 3rem'};
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

const IkonKnappWrapper = styled.div`
    display: block;
`;

interface Props {
    utgiftsperioder: ListState<IUtgiftsperiode>;
    valideringsfeil?: FormErrors<InnvilgeVedtakForm>['utgiftsperioder'];
    settValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
    barn: IBarnMedSamvær[];
    låsFraDatoFørsteRad: boolean;
}

const UtgiftsperiodeValg: React.FC<Props> = ({
    utgiftsperioder,
    valideringsfeil,
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
            utgiftsperioder.update(
                {
                    ...utgiftsperioder.value[index],
                    [property]: value,
                },
                index
            );
        }
        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
    };

    const leggTilTomRadUnder = (index: number) => {
        utgiftsperioder.setValue((prevState) => [
            ...prevState.slice(0, index + 1),
            tomUtgiftsperiodeRad(),
            ...prevState.slice(index + 1, prevState.length),
        ]);
    };

    const oppdaterUtgiftsperiodeDersomMidlertidigOpphør = (index: number) => {
        utgiftsperioder.update(
            {
                ...utgiftsperioder.value[index],
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
        utgiftsperioder.remove(index);
        settValideringsFeil((prevState: FormErrors<InnvilgeVedtakForm>) => {
            const utgiftsperioder = (prevState.utgiftsperioder ?? []).filter((_, i) => i !== index);
            return { ...prevState, utgiftsperioder };
        });
    };

    const slettPeriodeModalHvisSanksjon = (index: number) => {
        const periode = utgiftsperioder.value[index];
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
        <HorizontalScroll
            synligVedLukketMeny={'1470px'}
            synligVedÅpenMeny={'1770px'}
            åpenHøyremeny={åpenHøyremeny}
        >
            <UtgiftsperiodeRad lesevisning={!behandlingErRedigerbar} erHeader>
                <Label>Periodetype</Label>
                <Label>Aktivitet</Label>
                <Label>Periode fra og med</Label>
                <Label>Periode til og med</Label>
                <Label>Velg barn</Label>
                <Label>Ant.</Label>
                <Label>Utgifter</Label>
            </UtgiftsperiodeRad>
            {utgiftsperioder.value.map((utgiftsperiode, index) => {
                const { periodetype, aktivitetstype, årMånedFra, årMånedTil, utgifter } =
                    utgiftsperiode;
                const skalViseFjernKnapp = behandlingErRedigerbar && index !== 0;
                const barnForPeriode = barnFormatertForBarnVelger(barn);
                const ikkeValgteBarn = barnForPeriode.filter((barn) =>
                    utgiftsperiode.barn.includes(barn.value)
                );
                const opphørEllerSanksjon = erOpphørEllerSanksjon(periodetype);

                return (
                    <UtgiftsperiodeRad
                        key={utgiftsperiode.endretKey}
                        lesevisning={!behandlingErRedigerbar}
                    >
                        <PeriodetypeSelect
                            periodetype={periodetype}
                            oppdaterUtgiftsperiodeElement={(property, value) =>
                                oppdaterUtgiftsperiode(index, property, value)
                            }
                            lesevisning={!behandlingErRedigerbar}
                            feil={valideringsfeil && valideringsfeil[index]?.periodetype}
                        />
                        <AktivitetSelect
                            periodetype={periodetype}
                            aktivitet={aktivitetstype}
                            oppdaterUtgiftsperiodeElement={(property, value) =>
                                oppdaterUtgiftsperiode(index, property, value)
                            }
                            erLesevisning={!behandlingErRedigerbar}
                            feil={valideringsfeil && valideringsfeil[index]?.aktivitetstype}
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
                            feilmelding={valideringsfeil && valideringsfeil[index]?.årMånedFra}
                            erLesevisning={
                                !behandlingErRedigerbar ||
                                periodetype === EUtgiftsperiodetype.SANKSJON_1_MND
                            }
                            disabledFra={index === 0 && låsFraDatoFørsteRad}
                        />
                        {behandlingErRedigerbar && !opphørEllerSanksjon ? (
                            <FamilieReactSelect
                                placeholder={'Velg barn'}
                                label={''}
                                options={barnForPeriode}
                                creatable={false}
                                isMulti={true}
                                isDisabled={opphørEllerSanksjon}
                                defaultValue={ikkeValgteBarn}
                                value={opphørEllerSanksjon ? [] : ikkeValgteBarn}
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
                                        <BodyShortSmall key={barn.value}>
                                            {barn.label}
                                        </BodyShortSmall>
                                    ))}
                            </ContainerMedLuftUnder>
                        )}
                        {opphørEllerSanksjon ? (
                            <div />
                        ) : (
                            <AntallBarn lesevisning={behandlingErRedigerbar}>{`${
                                utgiftsperioder.value[index].barn
                                    ? utgiftsperioder.value[index].barn?.length
                                    : 0
                            }`}</AntallBarn>
                        )}
                        {opphørEllerSanksjon ? (
                            <div />
                        ) : (
                            <StyledInput
                                onKeyPress={tilHeltall}
                                type="number"
                                size={'small'}
                                value={harTallverdi(utgifter) ? utgifter : ''}
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
                            <IkonKnappWrapper>
                                <Tooltip content="Legg til rad under" placement="right">
                                    <LeggTilKnapp
                                        onClick={() => leggTilTomRadUnder(index)}
                                        ikontekst={'Legg til ny rad'}
                                    />
                                </Tooltip>
                            </IkonKnappWrapper>
                        )}
                        {skalViseFjernKnapp ? (
                            <IkonKnappWrapper>
                                <FjernKnapp
                                    onClick={() => slettPeriodeModalHvisSanksjon(index)}
                                    ikontekst={'Fjern utgiftsperiode'}
                                />
                            </IkonKnappWrapper>
                        ) : (
                            <div />
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
            <SlettSanksjonsperiodeModal
                sanksjonsmodal={sanksjonsmodal}
                slettPeriode={slettPeriode}
                lukkModal={lukkSanksjonsmodal}
            />
        </HorizontalScroll>
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
