import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import {
    EAktivitet,
    EBehandlingResultat,
    EPeriodeProperty,
    EPeriodetype,
    IPeriode,
    IVedtak,
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
import DatoPeriode from '../../Oppgavebenk/DatoPeriode';
import { differenceInMonths } from 'date-fns';
import { AddCircle, Delete } from '@navikt/ds-icons';
import { useBehandling } from '../../../context/BehandlingContext';
import AktivitetspliktVelger from './AktivitetspliktVelger';

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

const VedtaksresultatSwitch: React.FC<Props> = (props: Props) => {
    const { axiosRequest } = useApp();
    const { modalDispatch } = useModal();
    const { hentBehandling } = useBehandling();
    const history = useHistory();
    const [periodeBegrunnelse, settPeriodeBegrunnelse] = useState<string>('');
    const [inntektBegrunnelse, settInntektBegrunnelse] = useState<string>('');
    const [laster, settLaster] = useState<boolean>(false);
    const { vedtaksresultatType, behandlingId, settFeilmelding, lagretVedtak } = props;
    const tomVedtaksperiodeRad = {
        periodeType: '' as EPeriodetype,
        aktivitet: '' as EAktivitet,
        datoFra: '',
        datoTil: '',
    };
    const [vedtaksperiodeListe, settVedtaksperiodeListe] = useState<IPeriode[]>([
        tomVedtaksperiodeRad,
    ]);

    useEffect(() => {
        if (lagretVedtak) {
            settPeriodeBegrunnelse(lagretVedtak.periodeBegrunnelse);
            settInntektBegrunnelse(lagretVedtak.inntektBegrunnelse);
            settVedtaksperiodeListe(lagretVedtak.perioder);
        }
    }, [lagretVedtak]);

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
        value: string
    ) => {
        const nyListe = [...vedtaksperiodeListe];

        const nyttObjekt = {
            ...nyListe[index],
            [property]: value,
        };

        nyListe[index] = nyttObjekt;

        settVedtaksperiodeListe(nyListe);
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
                        const { periodeType, aktivitet, datoTil, datoFra } = element;

                        const antallMåneder =
                            datoFra && datoTil
                                ? differenceInMonths(new Date(datoTil), new Date(datoFra))
                                : undefined;

                        return (
                            <VedtaksperiodeRad>
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
                                <DatoPeriode
                                    datoFraTekst={index === 0 ? 'Fra og med' : ''}
                                    datoTilTekst={index === 0 ? 'Til og med' : ''}
                                    settDatoFra={(dato: string) => {
                                        oppdaterVedtakslisteElement(
                                            index,
                                            EPeriodeProperty.datoFra,
                                            dato
                                        );
                                    }}
                                    settDatoTil={(dato: string) => {
                                        oppdaterVedtakslisteElement(
                                            index,
                                            EPeriodeProperty.datoTil,
                                            dato
                                        );
                                    }}
                                    valgtDatoFra={datoFra}
                                    valgtDatoTil={datoTil}
                                    datoFeil={undefined}
                                />
                                {!!antallMåneder && (
                                    <Element style={{ marginTop: index === 0 ? '2.5rem' : '1rem' }}>
                                        {antallMåneder} måneder
                                    </Element>
                                )}
                                {index === vedtaksperiodeListe.length - 1 && index !== 0 && (
                                    <FjernVedtaksperiodeKnapp onClick={fjernVedtaksperiode}>
                                        <Delete />
                                        <span className="sr-only">Fjern vedtaksperiode</span>
                                    </FjernVedtaksperiodeKnapp>
                                )}
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
                        Lag blankett
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
