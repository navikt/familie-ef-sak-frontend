import React, { Dispatch, SetStateAction, useState } from 'react';
import {
    EAktivitet,
    EBehandlingResultat,
    EPeriodeProperty,
    EPeriodetype,
    IVedtaksperiode,
    IVedtak,
    periodeVariantTilProperty,
} from '../../../typer/vedtak';
import { Element } from 'nav-frontend-typografi';
import { Select, Textarea } from 'nav-frontend-skjema';
import { Flatknapp, Hovedknapp } from 'nav-frontend-knapper';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';
import { useApp } from '../../../context/AppContext';
import { ModalAction, ModalType, useModal } from '../../../context/ModalContext';
import styled from 'styled-components';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { useHistory } from 'react-router-dom';
import { AddCircle, Delete } from '@navikt/ds-icons';
import { useBehandling } from '../../../context/BehandlingContext';
import AktivitetspliktVelger from './AktivitetspliktVelger';
import MånedÅrPeriode, { PeriodeVariant } from '../../Felleskomponenter/MånedÅr/MånedÅrPeriode';
import { månederMellom, månedÅrTilDate } from '../../../utils/formatter';

interface Props {
    vedtaksresultatType: EBehandlingResultat;
    behandlingId: string;
    settFeilmelding: Dispatch<SetStateAction<string>>;
    lagretVedtak?: IVedtak;
}

const StyledAdvarsel = styled(AlertStripeAdvarsel)`
    margin-top: 2rem;
`;

const VedtaksperiodeRad = styled.div`
    display: flex;
    justify-content: flex-start;
    margin-bottom: 0.25rem;
`;

const LeggTilVedtaksperiodeKnapp = styled(Flatknapp)`
    padding: 0;
    margin-bottom: 1rem;
`;

const FjernVedtaksperiodeKnapp = styled(Flatknapp)`
    padding: 0;
    margin-bottom: 1rem;
    margin-left: 1rem;
`;

const StyledSelect = styled(Select)`
    max-width: 200px;
    margin-right: 2rem;
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

    const [vedtaksperiodeListe, settVedtaksperiodeListe] = useState<IVedtaksperiode[]>(
        lagretVedtak ? lagretVedtak.perioder : [tomVedtaksperiodeRad]
    );

    const leggTilVedtaksperiode = () => {
        const nyListe = [...vedtaksperiodeListe];

        nyListe.push(tomVedtaksperiodeRad);

        settVedtaksperiodeListe(nyListe);
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
                                        <FjernVedtaksperiodeKnapp onClick={fjernVedtaksperiode}>
                                            <Delete />
                                            <span className="sr-only">Fjern vedtaksperiode</span>
                                        </FjernVedtaksperiodeKnapp>
                                    )}
                                </MndKnappWrapper>
                            </VedtaksperiodeRad>
                        );
                    })}
                    <LeggTilVedtaksperiodeKnapp onClick={leggTilVedtaksperiode}>
                        <AddCircle style={{ marginRight: '1rem' }} />
                        Legg til vedtaksperiode
                    </LeggTilVedtaksperiodeKnapp>
                    <Textarea
                        value={periodeBegrunnelse}
                        onChange={(e) => {
                            settPeriodeBegrunnelse(e.target.value);
                        }}
                        label="Begrunnelse"
                    />
                    <Element style={{ marginBottom: '1rem', marginTop: '3rem' }}>Inntekt</Element>
                    <Textarea
                        value={inntektBegrunnelse}
                        onChange={(e) => {
                            settInntektBegrunnelse(e.target.value);
                        }}
                        label="Begrunnelse"
                    />
                    <Hovedknapp
                        style={{ marginTop: '2rem' }}
                        onClick={lagBlankett}
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
