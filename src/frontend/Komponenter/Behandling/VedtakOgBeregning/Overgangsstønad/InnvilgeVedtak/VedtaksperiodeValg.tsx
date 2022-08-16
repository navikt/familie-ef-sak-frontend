import {
    EAktivitet,
    EPeriodetype,
    EVedtaksperiodeProperty,
    IVedtaksperiode,
} from '../../../../../App/typer/vedtak';
import AktivitetspliktVelger from './AktivitetspliktVelger';
import MånedÅrPeriode, { PeriodeVariant } from '../../../../../Felles/Input/MånedÅr/MånedÅrPeriode';
import React, { Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import VedtakperiodeSelect from './VedtakperiodeSelect';
import LeggTilKnapp from '../../../../../Felles/Knapper/LeggTilKnapp';
import FjernKnapp from '../../../../../Felles/Knapper/FjernKnapp';
import { ListState } from '../../../../../App/hooks/felles/useListState';
import { Element } from 'nav-frontend-typografi';
import { FormErrors } from '../../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './InnvilgeVedtak';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import { useApp } from '../../../../../App/context/AppContext';
import { kalkulerAntallMåneder } from '../../../../../App/utils/dato';
import { Tooltip } from '@navikt/ds-react';
import { useToggles } from '../../../../../App/context/TogglesContext';
import { ToggleName } from '../../../../../App/context/toggles';
import { v4 as uuidv4 } from 'uuid';

const VedtakPeriodeContainer = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-areas: 'periodetype aktivitetstype fraOgMedVelger tilOgMedVelger antallMåneder fjernknapp leggTilKnapp';
    grid-template-columns: ${(props) =>
        props.lesevisning
            ? '8rem 10rem 7rem 7rem 7rem'
            : '12rem 12rem 11.5rem 11.5rem 4rem 3rem 3rem'};
    grid-gap: ${(props) => (props.lesevisning ? '0.5rem' : '1rem')};
`;

const KolonneHeaderWrapper = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-areas: 'periodetype aktivitetstype fraOgMedVelger tilOgMedVelger';
    grid-template-columns: ${(props) =>
        props.lesevisning ? '8rem 10rem 7rem 7rem 7rem' : '12rem 12rem 11.5rem 11.5rem 4rem'};
    grid-gap: ${(props) => (props.lesevisning ? '0.5rem' : '1rem')};
    margin-bottom: 0.5rem;
`;

const KnappWrapper = styled.div`
    button {
        width: 3rem;
    }
`;

interface Props {
    vedtaksperiodeListe: ListState<IVedtaksperiode>;
    valideringsfeil?: FormErrors<InnvilgeVedtakForm>['perioder'];
    setValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
    låsVedtaksperiodeRad?: boolean;
}

export const tomVedtaksperiodeRad = (): IVedtaksperiode => ({
    periodeType: '' as EPeriodetype,
    aktivitet: '' as EAktivitet,
    endretKey: uuidv4(),
});

const VedtaksperiodeValg: React.FC<Props> = ({
    vedtaksperiodeListe,
    valideringsfeil,
    setValideringsFeil,
    låsVedtaksperiodeRad,
}) => {
    const { behandlingErRedigerbar } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();
    const { toggles } = useToggles();
    const skalViseLeggTilKnapp =
        toggles[ToggleName.visVedtakPeriodeLeggTilRad] && behandlingErRedigerbar;

    const oppdaterVedtakslisteElement = (
        index: number,
        property: EVedtaksperiodeProperty,
        value: string | number | undefined
    ) => {
        vedtaksperiodeListe.update(
            {
                ...vedtaksperiodeListe.value[index],
                [property]: value,
                ...(property === EVedtaksperiodeProperty.periodeType && {
                    [EVedtaksperiodeProperty.aktivitet]:
                        value === EPeriodetype.PERIODE_FØR_FØDSEL ||
                        value === EPeriodetype.MIDLERTIDIG_OPPHØR
                            ? EAktivitet.IKKE_AKTIVITETSPLIKT
                            : undefined,
                }),
            },
            index
        );
        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
    };

    const leggTilTomRadUnder = (index: number) => {
        vedtaksperiodeListe.setValue((prevState) => [
            ...prevState.slice(0, index + 1),
            tomVedtaksperiodeRad(),
            ...prevState.slice(index + 1, prevState.length),
        ]);
    };

    const periodeVariantTilVedtaksperiodeProperty = (
        periodeVariant: PeriodeVariant
    ): EVedtaksperiodeProperty => {
        switch (periodeVariant) {
            case PeriodeVariant.ÅR_MÅNED_FRA:
                return EVedtaksperiodeProperty.årMånedFra;
            case PeriodeVariant.ÅR_MÅNED_TIL:
                return EVedtaksperiodeProperty.årMånedTil;
        }
    };

    return (
        <>
            <KolonneHeaderWrapper lesevisning={!behandlingErRedigerbar}>
                <Element>Periodetype</Element>
                <Element>Aktivitet</Element>
                <Element>Fra og med</Element>
                <Element>Til og med</Element>
            </KolonneHeaderWrapper>
            {vedtaksperiodeListe.value.map((vedtaksperiode, index) => {
                const { periodeType, aktivitet, årMånedFra, årMånedTil } = vedtaksperiode;
                const antallMåneder = kalkulerAntallMåneder(årMånedFra, årMånedTil);
                // når featuretoggle for skalViseLeggTilKnapp fjernes, så kan skalViseFjernKnapp inlineas då den alltid skal vises
                const skalViseFjernKnapp =
                    behandlingErRedigerbar &&
                    (skalViseLeggTilKnapp ||
                        (index === vedtaksperiodeListe.value.length - 1 && index !== 0));

                return (
                    <VedtakPeriodeContainer
                        key={vedtaksperiode.endretKey}
                        lesevisning={!behandlingErRedigerbar}
                    >
                        <VedtakperiodeSelect
                            feil={valideringsfeil && valideringsfeil[index]?.periodeType}
                            oppdaterVedtakslisteElement={(property, value) =>
                                oppdaterVedtakslisteElement(index, property, value)
                            }
                            behandlingErRedigerbar={behandlingErRedigerbar}
                            periodeType={periodeType}
                            index={index}
                        />
                        <AktivitetspliktVelger
                            index={index}
                            aktivitet={aktivitet}
                            periodeType={periodeType}
                            oppdaterVedtakslisteElement={oppdaterVedtakslisteElement}
                            erLesevisning={!behandlingErRedigerbar}
                            aktivitetfeil={valideringsfeil && valideringsfeil[index]?.aktivitet}
                        />
                        <MånedÅrPeriode
                            årMånedFraInitiell={årMånedFra}
                            årMånedTilInitiell={årMånedTil}
                            index={index}
                            onEndre={(verdi, periodeVariant) => {
                                oppdaterVedtakslisteElement(
                                    index,
                                    periodeVariantTilVedtaksperiodeProperty(periodeVariant),
                                    verdi
                                );
                            }}
                            feilmelding={valideringsfeil && valideringsfeil[index]?.årMånedFra}
                            erLesevisning={!behandlingErRedigerbar}
                            disabledFra={index === 0 && låsVedtaksperiodeRad}
                        />
                        <Element style={{ marginTop: behandlingErRedigerbar ? '0.65rem' : 0 }}>
                            {antallMåneder && `${antallMåneder} mnd`}
                        </Element>
                        {skalViseFjernKnapp && (
                            <FjernKnapp
                                onClick={() => {
                                    vedtaksperiodeListe.remove(index);
                                    setValideringsFeil(
                                        (prevState: FormErrors<InnvilgeVedtakForm>) => {
                                            const perioder = (prevState.perioder ?? []).filter(
                                                (_, i) => i !== index
                                            );
                                            return { ...prevState, perioder };
                                        }
                                    );
                                }}
                                knappetekst="Fjern vedtaksperiode"
                            />
                        )}
                        {skalViseLeggTilKnapp && (
                            <Tooltip content="Legg til rad under" placement="right">
                                <KnappWrapper>
                                    <LeggTilKnapp
                                        onClick={() => {
                                            leggTilTomRadUnder(index);
                                        }}
                                    />
                                </KnappWrapper>
                            </Tooltip>
                        )}
                    </VedtakPeriodeContainer>
                );
            })}
            <LeggTilKnapp
                onClick={() => vedtaksperiodeListe.push(tomVedtaksperiodeRad())}
                knappetekst="Legg til vedtaksperiode"
                hidden={!behandlingErRedigerbar}
            />
        </>
    );
};

export default VedtaksperiodeValg;
