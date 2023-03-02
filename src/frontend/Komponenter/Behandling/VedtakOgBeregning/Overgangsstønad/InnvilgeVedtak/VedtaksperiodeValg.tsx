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
import { InnvilgeVedtakForm } from './InnvilgeVedtak';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import { useApp } from '../../../../../App/context/AppContext';
import { kalkulerAntallMåneder } from '../../../../../App/utils/dato';
import { Label, Tooltip } from '@navikt/ds-react';
import { v4 as uuidv4 } from 'uuid';
import FjernKnapp from '../../../../../Felles/Knapper/FjernKnapp';
import {
    Sanksjonsmodal,
    SlettSanksjonsperiodeModal,
} from '../../Felles/SlettSanksjonsperiodeModal';
import { HorizontalScroll } from '../../Felles/HorizontalScroll';

const Grid = styled.div<{ lesevisning?: boolean }>`
    display: grid;
    grid-template-columns: ${(props) =>
        props.lesevisning ? 'repeat(5, max-content)' : '12rem 12rem repeat(5, max-content)'};
    grid-gap: 0.5rem 1rem;

    .ny-rad {
        grid-column: 1;
    }
`;

const LeggTilRadKnapp = styled(LeggTilKnapp)`
    margin-top: 0.5rem;
`;

interface Props {
    className?: string;
    setValideringsFeil: Dispatch<SetStateAction<FormErrors<InnvilgeVedtakForm>>>;
    låsVedtaksperiodeRad?: boolean;
    valideringsfeil?: FormErrors<InnvilgeVedtakForm>['perioder'];
    vedtaksperiodeListe: ListState<IVedtaksperiode>;
}

export const tomVedtaksperiodeRad = (årMånedFra?: string): IVedtaksperiode => ({
    periodeType: '' as EPeriodetype,
    aktivitet: '' as EAktivitet,
    årMånedFra: årMånedFra,
    endretKey: uuidv4(),
});

const VedtaksperiodeValg: React.FC<Props> = ({
    className,
    låsVedtaksperiodeRad,
    setValideringsFeil,
    valideringsfeil,
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
        <HorizontalScroll
            className={className}
            synligVedLukketMeny={'1145px'}
            synligVedÅpenMeny={'1440px'}
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
                        <>
                            <VedtakperiodeSelect
                                className={'ny-rad'}
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
                                erLesevisning={
                                    !behandlingErRedigerbar || periodeType === EPeriodetype.SANKSJON
                                }
                                disabledFra={index === 0 && låsVedtaksperiodeRad}
                            />
                            <Label style={{ marginTop: behandlingErRedigerbar ? '0.65rem' : 0 }}>
                                {antallMåneder && `${antallMåneder} mnd`}
                            </Label>
                            {behandlingErRedigerbar && (
                                <Tooltip content="Legg til rad under" placement="right">
                                    <LeggTilKnapp
                                        onClick={() => {
                                            leggTilTomRadUnder(index);
                                        }}
                                        ikontekst={'Legg til ny rad'}
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
                        </>
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
    );
};

export default VedtaksperiodeValg;
