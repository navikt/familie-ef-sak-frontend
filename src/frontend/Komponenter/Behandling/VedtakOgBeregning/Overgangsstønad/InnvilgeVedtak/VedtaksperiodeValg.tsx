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

const VedtakPeriodeContainer = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-areas: 'periodetype aktivitetstype fraOgMedVelger tilOgMedVelger antallMåneder fjernknapp';
    grid-template-columns: ${(props) =>
        props.lesevisning ? '8rem 10rem 7rem 7rem 7rem' : '12rem 12rem 11.5rem 11.5rem 4rem'};
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

interface Props {
    vedtaksperiodeListe: ListState<IVedtaksperiode>;
    valideringsfeil?: FormErrors<InnvilgeVedtakForm>['perioder'];
    setValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
}

export const tomVedtaksperiodeRad: IVedtaksperiode = {
    periodeType: '' as EPeriodetype,
    aktivitet: '' as EAktivitet,
};

const VedtaksperiodeValg: React.FC<Props> = ({
    vedtaksperiodeListe,
    valideringsfeil,
    setValideringsFeil,
}) => {
    const { behandlingErRedigerbar } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();

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
                const skalViseFjernKnapp =
                    behandlingErRedigerbar &&
                    index === vedtaksperiodeListe.value.length - 1 &&
                    index !== 0;

                return (
                    <VedtakPeriodeContainer key={index} lesevisning={!behandlingErRedigerbar}>
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
                        />
                        {antallMåneder && (
                            <Element
                                style={{ marginTop: behandlingErRedigerbar ? '0.65rem' : 0 }}
                            >{`${antallMåneder} mnd`}</Element>
                        )}
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
                    </VedtakPeriodeContainer>
                );
            })}
            <LeggTilKnapp
                onClick={() => vedtaksperiodeListe.push(tomVedtaksperiodeRad)}
                knappetekst="Legg til vedtaksperiode"
                hidden={!behandlingErRedigerbar}
            />
        </>
    );
};

export default VedtaksperiodeValg;
