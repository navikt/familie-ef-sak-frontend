import React, { Dispatch, SetStateAction, useState } from 'react';
import {
    EAktivitet,
    EBehandlingResultat,
    EPeriodeProperty,
    EPeriodetype,
    IVedtaksperiode,
    IVedtak,
    periodeVariantTilProperty,
    IInntektsperiode,
    EInntektsperiodeProperty,
    IValideringsfeil,
} from '../../../typer/vedtak';
import { Element } from 'nav-frontend-typografi';
import { Select, Textarea, Checkbox, Input } from 'nav-frontend-skjema';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';
import { useApp } from '../../../context/AppContext';
import { ModalAction, ModalType, useModal } from '../../../context/ModalContext';
import styled from 'styled-components';
import { AlertStripeAdvarsel, AlertStripeFeil } from 'nav-frontend-alertstriper';
import { useHistory } from 'react-router-dom';
import { AddCircle, Delete, Calculator } from '@navikt/ds-icons';
import { useBehandling } from '../../../context/BehandlingContext';
import AktivitetspliktVelger from './AktivitetspliktVelger';
import MånedÅrPeriode, { PeriodeVariant } from '../../Felleskomponenter/MånedÅr/MånedÅrPeriode';
import MånedÅrVelger from '../../Felleskomponenter/MånedÅr/MånedÅrVelger';
import { månederMellom, månedÅrTilDate } from '../../../utils/dato';
import { validerVedtaksperioder } from './vedtaksvalidering';
import TekstMedLabel from '../../Felleskomponenter/TekstMedLabel/TekstMedLabel';

interface Props {
    vedtaksresultatType: EBehandlingResultat;
    behandlingId: string;
    settFeilmelding: Dispatch<SetStateAction<string>>;
    lagretVedtak?: IVedtak;
}

const Inntekt = styled.div`
    padding-bottom: 2rem;
`;

const StyledTekstMedLabel = styled(TekstMedLabel)`
    margin-left: 1rem;
`;

const StyledBeløpMedSamordning = styled(TekstMedLabel)`
    min-width: 150px;
`;

const Knapper = styled.div`
    max-width: 500px;
    display: flex;
    justify-content: space-between;
`;

const InntektsperiodeRad = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-bottom: 0.25rem;
`;

const StyledAdvarsel = styled(AlertStripeAdvarsel)`
    margin-top: 2rem;
`;

const VedtaksperiodeRad = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-bottom: 0.25rem;
`;

const KnappMedLuftUnder = styled(Flatknapp)`
    padding: 0;
    margin-bottom: 1rem;
`;

const FjernPeriodeKnapp = styled(Flatknapp)`
    padding: 0;
    margin-left: 1rem;
`;

const StyledSelect = styled(Select)`
    max-width: 200px;
    margin-right: 2rem;
`;

const StyledInput = styled(Input)`
    max-width: 200px;
    margin-right: 2rem;
`;

const StyledSamordningsfradrag = styled(StyledInput)`
    min-width: 200px;
`;

const MndKnappWrapper = styled.div`
    width: 90px;
    display: flex;
`;

const kalkulerAntallMåneder = (årMånedFra?: string, årMånedTil?: string): number | undefined => {
    if (årMånedFra && årMånedTil) {
        return månederMellom(månedÅrTilDate(årMånedFra), månedÅrTilDate(årMånedTil));
    }
    return undefined;
};

const VedtaksresultatSwitch: React.FC<Props> = (props: Props) => {
    const { axiosRequest } = useApp();
    const { modalDispatch } = useModal();
    const { hentBehandling } = useBehandling();
    const history = useHistory();
    const { vedtaksresultatType, behandlingId, settFeilmelding, lagretVedtak } = props;

    const [valideringsfeil, settValideringsfeil] = useState<IValideringsfeil>({
        vedtaksperioder: [],
        inntektsperioder: [],
    });

    const [visSamordning, settVisSamordning] = useState<boolean>(
        lagretVedtak?.periodeInntekt?.some(
            (el) => el.samordningsfradag && el.samordningsfradag > 0
        ) || false
    );

    const [periodeBegrunnelse, settPeriodeBegrunnelse] = useState<string>(
        lagretVedtak?.periodeBegrunnelse || ''
    );
    const [inntektBegrunnelse, settInntektBegrunnelse] = useState<string>(
        lagretVedtak?.inntektBegrunnelse || ''
    );
    const [laster, settLaster] = useState<boolean>(false);
    const tomVedtaksperiodeRad = {
        periodeType: '' as EPeriodetype,
        aktivitet: '' as EAktivitet,
    };

    const tomInntektsperiodeRad: IInntektsperiode = {
        årMånedFra: '',
        forventetInntekt: undefined,
        stønadsbeløp: 0,
    };

    const validerVedtak = (): boolean => {
        const validerteVedtaksperioder = validerVedtaksperioder(
            inntektsperiodeListe,
            vedtaksperiodeListe
        );
        settValideringsfeil(validerteVedtaksperioder);
        return (
            validerteVedtaksperioder.vedtaksperioder.length === 0 &&
            validerteVedtaksperioder.inntektsperioder.length === 0
        );
    };

    const [vedtaksperiodeListe, settVedtaksperiodeListe] = useState<IVedtaksperiode[]>(
        lagretVedtak ? lagretVedtak.perioder : [tomVedtaksperiodeRad]
    );

    const [inntektsperiodeListe, settInntektsperiodeListe] = useState<IInntektsperiode[]>(
        lagretVedtak ? lagretVedtak.periodeInntekt : [tomInntektsperiodeRad]
    );

    const leggTilInntektsperiode = () => {
        settInntektsperiodeListe([...inntektsperiodeListe, tomInntektsperiodeRad]);
    };

    const fjernInntektsperiode = () => {
        const nyListe = [...inntektsperiodeListe];

        nyListe.pop();

        settInntektsperiodeListe(nyListe);
    };

    const oppdaterInntektslisteElement = (
        index: number,
        property: EInntektsperiodeProperty,
        value: string | number | undefined
    ) => {
        const oppdatertListe = inntektsperiodeListe.map((inntektsperiode, i) => {
            if (i === index) {
                return { ...inntektsperiode, [property]: value };
            }

            return inntektsperiode;
        });

        settInntektsperiodeListe(oppdatertListe);
    };

    const oppdaterInntektslisteMedBeløp = () => {
        const oppdatertListe = inntektsperiodeListe.map((rad, i) => {
            const beløpFørSamordning = 20000 - (0.5 * (rad.forventetInntekt || 0)) / 12;

            const stønadsbeløp = beløpFørSamordning - (rad.samordningsfradrag || 0);

            return { ...rad, stønadsbeløp, beløpFørSamordning };
        });

        settInntektsperiodeListe(oppdatertListe);
    };

    const leggTilVedtaksperiode = () => {
        settVedtaksperiodeListe([...vedtaksperiodeListe, tomVedtaksperiodeRad]);
    };

    const fjernVedtaksperiode = () => {
        const nyListe = [...vedtaksperiodeListe];

        nyListe.pop();

        settVedtaksperiodeListe(nyListe);
    };

    const oppdaterVedtakslisteElement = (
        index: number,
        property: EPeriodeProperty,
        value: string | number | undefined
    ) => {
        const oppdatertListe = vedtaksperiodeListe.map((vedtaksperiode, i) => {
            if (i === index) {
                return { ...vedtaksperiode, [property]: value };
            }
            return vedtaksperiode;
        });

        settVedtaksperiodeListe(oppdatertListe);
    };

    const lagBlankett = () => {
        settLaster(true);
        axiosRequest<string, IVedtak>({
            method: 'POST',
            url: `/familie-ef-sak/api/beregning/${behandlingId}/lagre-vedtak`,
            data: {
                resultatType: vedtaksresultatType,
                periodeBegrunnelse,
                inntektBegrunnelse,
                perioder: vedtaksperiodeListe,
                periodeInntekt: inntektsperiodeListe,
            },
        })
            .then((res: Ressurs<string>) => {
                switch (res.status) {
                    case RessursStatus.SUKSESS:
                        history.push(`/behandling/${behandlingId}/blankett`);
                        hentBehandling.rerun();
                        break;
                    case RessursStatus.HENTER:
                    case RessursStatus.IKKE_HENTET:
                        break;
                    default:
                        settFeilmelding(res.frontendFeilmelding);
                }
            })
            .finally(() => {
                settLaster(false);
            });
    };

    const behandleIGosys = () => {
        settLaster(true);
        axiosRequest<{ id: string }, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/behandling/${behandlingId}/annuller`,
        })
            .then((res: Ressurs<{ id: string }>) => {
                switch (res.status) {
                    case RessursStatus.SUKSESS:
                        modalDispatch({
                            type: ModalAction.VIS_MODAL,
                            modalType: ModalType.BEHANDLES_I_GOSYS,
                        });
                        break;
                    case RessursStatus.HENTER:
                    case RessursStatus.IKKE_HENTET:
                        break;
                    default:
                        settFeilmelding(res.frontendFeilmelding);
                }
            })
            .finally(() => {
                settLaster(false);
            });
    };
    switch (vedtaksresultatType) {
        case EBehandlingResultat.INNVILGE:
            return (
                <>
                    <Element style={{ marginBottom: '1rem', marginTop: '3rem' }}>
                        Vedtaksperiode
                    </Element>
                    {vedtaksperiodeListe.map((element, index) => {
                        const { periodeType, aktivitet, årMånedFra, årMånedTil } = element;
                        const antallMåneder = kalkulerAntallMåneder(årMånedFra, årMånedTil);

                        return (
                            <VedtaksperiodeRad key={index}>
                                <StyledSelect
                                    label={index === 0 && 'Periodetype'}
                                    value={periodeType}
                                    onChange={(e) => {
                                        settFeilmelding('');
                                        oppdaterVedtakslisteElement(
                                            index,
                                            EPeriodeProperty.periodeType,
                                            e.target.value
                                        );
                                    }}
                                >
                                    <option value="">Velg</option>
                                    <option value={EPeriodetype.PERIODE_FØR_FØDSEL}>
                                        Periode før fødsel
                                    </option>
                                    <option value={EPeriodetype.HOVEDPERIODE}>Hovedperiode</option>
                                </StyledSelect>
                                <AktivitetspliktVelger
                                    index={index}
                                    aktivitet={aktivitet}
                                    periodeType={periodeType}
                                    settFeilmelding={settFeilmelding}
                                    oppdaterVedtakslisteElement={oppdaterVedtakslisteElement}
                                />
                                <MånedÅrPeriode
                                    datoFraTekst={index === 0 ? 'Fra og med' : ''}
                                    datoTilTekst={index === 0 ? 'Til og med' : ''}
                                    årMånedFraInitiell={årMånedFra}
                                    årMånedTilInitiell={årMånedTil}
                                    onEndre={(
                                        verdi: string | undefined,
                                        periodeVariant: PeriodeVariant
                                    ) => {
                                        oppdaterVedtakslisteElement(
                                            index,
                                            periodeVariantTilProperty(periodeVariant),
                                            verdi
                                        );
                                    }}
                                    feilmelding={undefined}
                                />

                                <MndKnappWrapper>
                                    <Element style={{ marginTop: index === 0 ? '2.5rem' : '1rem' }}>
                                        {!!antallMåneder && `${antallMåneder} mnd`}
                                    </Element>
                                    {index === vedtaksperiodeListe.length - 1 && index !== 0 && (
                                        <FjernPeriodeKnapp onClick={fjernVedtaksperiode}>
                                            <Delete />
                                            <span className="sr-only">Fjern vedtaksperiode</span>
                                        </FjernPeriodeKnapp>
                                    )}
                                </MndKnappWrapper>
                            </VedtaksperiodeRad>
                        );
                    })}
                    {valideringsfeil.vedtaksperioder.map((feil) => (
                        <AlertStripeFeil>{feil}</AlertStripeFeil>
                    ))}
                    <KnappMedLuftUnder onClick={leggTilVedtaksperiode}>
                        <AddCircle style={{ marginRight: '1rem' }} />
                        Legg til vedtaksperiode
                    </KnappMedLuftUnder>
                    <Textarea
                        value={periodeBegrunnelse}
                        onChange={(e) => {
                            settPeriodeBegrunnelse(e.target.value);
                        }}
                        label="Begrunnelse"
                    />
                    <Element style={{ marginBottom: '1rem', marginTop: '3rem' }}>Inntekt</Element>
                    <Inntekt>
                        <Checkbox
                            label="Vis samordning"
                            onClick={() => {
                                settVisSamordning(!visSamordning);
                            }}
                            checked={visSamordning}
                        />
                    </Inntekt>
                    {inntektsperiodeListe.map((rad, index) => {
                        const samordningsfradrag = rad.samordningsfradrag || 0;
                        const forventetInntekt = rad.forventetInntekt || 0;

                        const stønadsbeløp = forventetInntekt - samordningsfradrag;

                        return (
                            <InntektsperiodeRad key={index}>
                                <MånedÅrVelger
                                    label={index === 0 ? 'Fra' : ''}
                                    onEndret={(e) => {
                                        oppdaterInntektslisteElement(
                                            index,
                                            EInntektsperiodeProperty.årMånedFra,
                                            e
                                        );
                                    }}
                                    årMånedInitiell={rad.årMånedFra}
                                    antallÅrTilbake={10}
                                    antallÅrFrem={4}
                                />

                                <StyledInput
                                    label={index === 0 && 'Forventet inntekt (år)'}
                                    type="number"
                                    value={rad.forventetInntekt}
                                    onChange={(e) => {
                                        oppdaterInntektslisteElement(
                                            index,
                                            EInntektsperiodeProperty.forventetInntekt,
                                            parseInt(e.target.value, 10)
                                        );
                                    }}
                                />

                                {visSamordning && (
                                    <StyledBeløpMedSamordning
                                        label={index === 0 ? 'Beløp før samordning' : ''}
                                        tekst={rad.beløpFørSamordning?.toString() || ''}
                                    />
                                )}

                                {visSamordning && (
                                    <StyledSamordningsfradrag
                                        label={index === 0 && 'Samordningsfradrag (mnd)'}
                                        type="number"
                                        value={rad.samordningsfradrag}
                                        onChange={(e) => {
                                            oppdaterInntektslisteElement(
                                                index,
                                                EInntektsperiodeProperty.samordningsfradrag,
                                                parseInt(e.target.value, 10)
                                            );
                                        }}
                                    />
                                )}

                                <StyledTekstMedLabel
                                    label={index === 0 ? 'Stønadsbeløp' : ''}
                                    tekst={rad.stønadsbeløp?.toString() || ''}
                                />

                                <MndKnappWrapper>
                                    {index === inntektsperiodeListe.length - 1 && index !== 0 && (
                                        <FjernPeriodeKnapp onClick={fjernInntektsperiode}>
                                            <Delete />
                                            <span className="sr-only">Fjern inntektsperiode</span>
                                        </FjernPeriodeKnapp>
                                    )}
                                </MndKnappWrapper>
                            </InntektsperiodeRad>
                        );
                    })}
                    {valideringsfeil.inntektsperioder.map((feil) => (
                        <AlertStripeFeil>{feil}</AlertStripeFeil>
                    ))}
                    <Knapper>
                        <KnappMedLuftUnder onClick={leggTilInntektsperiode}>
                            <AddCircle style={{ marginRight: '1rem' }} />
                            Legg til inntektsperiode
                        </KnappMedLuftUnder>
                        <KnappMedLuftUnder
                            onClick={(e) => {
                                oppdaterInntektslisteMedBeløp();
                            }}
                        >
                            <Calculator style={{ marginRight: '1rem' }} />
                            Beregn stønadsbeløp
                        </KnappMedLuftUnder>
                    </Knapper>
                    <Textarea
                        value={inntektBegrunnelse}
                        onChange={(e) => {
                            settInntektBegrunnelse(e.target.value);
                        }}
                        label="Begrunnelse"
                    />
                    <Hovedknapp
                        style={{ marginTop: '2rem' }}
                        onClick={() => {
                            if (validerVedtak()) {
                                lagBlankett();
                            }
                        }}
                        disabled={laster}
                    >
                        Lagre vedtak
                    </Hovedknapp>
                </>
            );
        case EBehandlingResultat.BEHANDLE_I_GOSYS:
            return (
                <>
                    <StyledAdvarsel>Oppgaven annulleres og må fullføres i Gosys</StyledAdvarsel>
                    <Hovedknapp
                        style={{ marginTop: '2rem' }}
                        onClick={behandleIGosys}
                        disabled={laster}
                    >
                        Avslutt og behandle i Gosys
                    </Hovedknapp>
                </>
            );
        default:
            return null;
    }
};

export default VedtaksresultatSwitch;
