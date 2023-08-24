import {
    EAktivitet,
    EPeriodetype,
    EVedtaksperiodeProperty,
    IVedtaksperiode,
} from '../../../../../App/typer/vedtak';
import AktivitetspliktVelger from './AktivitetspliktVelger';
import MånedÅrPeriode, { PeriodeVariant } from '../../../../../Felles/Input/MånedÅr/MånedÅrPeriode';
import React, { Dispatch, SetStateAction, useState } from 'react';
import styled from 'styled-components';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import VedtakperiodeSelect from './VedtakperiodeSelect';
import LeggTilKnapp from '../../../../../Felles/Knapper/LeggTilKnapp';
import { ListState } from '../../../../../App/hooks/felles/useListState';
import { FormErrors } from '../../../../../App/hooks/felles/useFormState';
import { InnvilgeVedtakForm } from './InnvilgeOvergangsstønad';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import { useApp } from '../../../../../App/context/AppContext';
import { kalkulerAntallMåneder } from '../../../../../App/utils/dato';
import { Heading, Label, Tooltip } from '@navikt/ds-react';
import FjernKnapp from '../../../../../Felles/Knapper/FjernKnapp';
import {
    Sanksjonsmodal,
    SlettSanksjonsperiodeModal,
} from '../../Felles/SlettSanksjonsperiodeModal';
import { HorizontalScroll } from '../../Felles/HorizontalScroll';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';
import { IngenBegrunnelseOppgitt } from './IngenBegrunnelseOppgitt';
import { EnsligTextArea } from '../../../../../Felles/Input/TekstInput/EnsligTextArea';
import { FieldState } from '../../../../../App/hooks/felles/useFieldState';
import { tomVedtaksperiodeRad } from '../Felles/utils';

const Container = styled.div`
    padding: 1rem;
    background-color: ${AGray50};
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Grid = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-columns: ${(props) =>
        props.lesevisning ? 'repeat(5, max-content)' : '12rem 12rem repeat(5, max-content)'};
    grid-gap: 0.5rem 1rem;
    align-items: start;

    .ny-rad {
        grid-column: 1;
    }
`;

const LeggTilRadKnapp = styled(LeggTilKnapp)`
    margin-top: 0.5rem;
`;

interface Props {
    className?: string;
    periodeBegrunnelseState: FieldState;
    setValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
    låsVedtaksperiodeRad?: boolean;
    errorState?: FormErrors<InnvilgeVedtakForm>;
    vedtaksperiodeListe: ListState<IVedtaksperiode>;
}

const VedtaksperiodeValg: React.FC<Props> = ({
    className,
    errorState,
    periodeBegrunnelseState,
    låsVedtaksperiodeRad,
    setValideringsFeil,
    vedtaksperiodeListe,
}) => {
    const { behandlingErRedigerbar, åpenHøyremeny } = useBehandling();
    const { settIkkePersistertKomponent } = useApp();

    const [sanksjonsmodal, settSanksjonsmodal] = useState<Sanksjonsmodal>({
        visModal: false,
    });

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

    const lukkSanksjonsmodal = () => {
        settSanksjonsmodal({ visModal: false });
    };

    const slettPeriode = (index: number) => {
        if (sanksjonsmodal.visModal) {
            lukkSanksjonsmodal();
        }
        vedtaksperiodeListe.remove(index);
        setValideringsFeil((prevState: FormErrors<InnvilgeVedtakForm>) => {
            const perioder = (prevState.perioder ?? []).filter((_, i) => i !== index);
            return { ...prevState, perioder };
        });
    };

    const slettPeriodeModalHvisSanksjon = (index: number) => {
        const periode = vedtaksperiodeListe.value[index];
        if (periode.periodeType === EPeriodetype.SANKSJON) {
            settSanksjonsmodal({
                visModal: true,
                index: index,
                årMånedFra: periode.årMånedFra || '',
            });
        } else {
            slettPeriode(index);
        }
    };

    return (
        <Container>
            <Heading size="small" level="5">
                Vedtaksperiode
            </Heading>
            {!behandlingErRedigerbar && periodeBegrunnelseState.value === '' ? (
                <IngenBegrunnelseOppgitt />
            ) : (
                <EnsligTextArea
                    value={periodeBegrunnelseState.value}
                    onChange={(event) => {
                        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                        periodeBegrunnelseState.onChange(event);
                    }}
                    label="Begrunnelse for vedtaksperiode"
                    maxLength={0}
                    erLesevisning={!behandlingErRedigerbar}
                    feilmelding={errorState?.periodeBegrunnelse}
                />
            )}
            <HorizontalScroll
                className={className}
                synligVedLukketMeny={'1160px'}
                synligVedÅpenMeny={'1455px'}
                åpenHøyremeny={åpenHøyremeny}
            >
                <Grid lesevisning={!behandlingErRedigerbar}>
                    <Label>Periodetype</Label>
                    <Label>Aktivitet</Label>
                    <Label>Fra og med</Label>
                    <Label>Til og med</Label>
                    {vedtaksperiodeListe.value.map((vedtaksperiode, index) => {
                        const { periodeType, aktivitet, årMånedFra, årMånedTil } = vedtaksperiode;
                        const antallMåneder = kalkulerAntallMåneder(årMånedFra, årMånedTil);
                        const skalViseFjernKnapp = behandlingErRedigerbar && index !== 0;
                        return (
                            <React.Fragment key={vedtaksperiode.endretKey}>
                                <VedtakperiodeSelect
                                    className={'ny-rad'}
                                    feil={
                                        errorState?.perioder &&
                                        errorState.perioder[index]?.periodeType
                                    }
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
                                    aktivitetfeil={
                                        errorState?.perioder &&
                                        errorState.perioder[index]?.aktivitet
                                    }
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
                                    feilmelding={
                                        errorState?.perioder &&
                                        errorState.perioder[index]?.årMånedFra
                                    }
                                    erLesevisning={
                                        !behandlingErRedigerbar ||
                                        periodeType === EPeriodetype.SANKSJON
                                    }
                                    disabledFra={index === 0 && låsVedtaksperiodeRad}
                                />
                                <Label
                                    style={{ marginTop: behandlingErRedigerbar ? '0.65rem' : 0 }}
                                >
                                    {antallMåneder && `${antallMåneder} mnd`}
                                </Label>
                                {behandlingErRedigerbar && (
                                    <Tooltip content="Legg til rad under" placement="right">
                                        <LeggTilKnapp
                                            onClick={() => {
                                                leggTilTomRadUnder(index);
                                            }}
                                            ikontekst={'Legg til ny rad'}
                                            variant="tertiary"
                                        />
                                    </Tooltip>
                                )}
                                {skalViseFjernKnapp ? (
                                    <FjernKnapp
                                        onClick={() => slettPeriodeModalHvisSanksjon(index)}
                                        ikontekst={'Fjern vedtaksperiode'}
                                    />
                                ) : (
                                    <div />
                                )}
                            </React.Fragment>
                        );
                    })}
                </Grid>
                {behandlingErRedigerbar && (
                    <LeggTilRadKnapp
                        onClick={() => vedtaksperiodeListe.push(tomVedtaksperiodeRad())}
                        knappetekst="Legg til vedtaksperiode"
                    />
                )}
                <SlettSanksjonsperiodeModal
                    sanksjonsmodal={sanksjonsmodal}
                    slettPeriode={slettPeriode}
                    lukkModal={lukkSanksjonsmodal}
                />
            </HorizontalScroll>
        </Container>
    );
};

export default VedtaksperiodeValg;
