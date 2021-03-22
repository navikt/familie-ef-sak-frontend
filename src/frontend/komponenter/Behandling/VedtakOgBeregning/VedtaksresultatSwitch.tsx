import React, { Dispatch, SetStateAction, useState } from 'react';
import { EBehandlingResultat, IVedtak, EAktivitet, EPeriodetype } from '../../../typer/vedtak';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import { Select, Textarea } from 'nav-frontend-skjema';
import { Hovedknapp, Flatknapp } from 'nav-frontend-knapper';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';
import { useApp } from '../../../context/AppContext';
import { ModalAction, ModalType, useModal } from '../../../context/ModalContext';
import styled from 'styled-components';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { useHistory } from 'react-router-dom';
import DatoPeriode from '../../Oppgavebenk/DatoPeriode';
import { differenceInMonths } from 'date-fns';
import { AddCircle } from '@navikt/ds-icons';
import TekstMedLabel from '../../Felleskomponenter/TekstMedLabel/TekstMedLabel';

interface Props {
    vedtaksresultatType: EBehandlingResultat;
    behandlingId: string;
    settFeilmelding: Dispatch<SetStateAction<string>>;
}

const StyledAdvarsel = styled(AlertStripeAdvarsel)`
    margin-top: 2rem;
`;

const VedtaksperiodeRad = styled.div`
    display: flex;
    justify-content: flex-start;
`;

const StyledSelect = styled(Select)`
    max-width: 200px;
    margin-right: 2rem;
`;

const Månedsdifferanse = styled(Element)`
    margin-top: 2.5rem;
`;

const VedtaksresultatSwitch: React.FC<Props> = (props: Props) => {
    const { axiosRequest } = useApp();
    const { modalDispatch } = useModal();
    const history = useHistory();
    const [periodeBegrunnelse, settPeriodeBegrunnelse] = useState<string>('');
    const [inntektBegrunnelse, settInntektBegrunnelse] = useState<string>('');
    const [laster, settLaster] = useState<boolean>(false);
    const { vedtaksresultatType, behandlingId, settFeilmelding } = props;
    const [fraOgMedDato, settFraOgMedDato] = useState('');
    const [tilOgMedDato, settTilOgMedDato] = useState('');
    const [periodetype, settPeriodetype] = useState<EPeriodetype>();
    const [aktivitet, settAktivitet] = useState('');
    const [vedtaksperiodeListe, settVedtaksperiodeListe] = useState([
        { periodetype: '' as EPeriodetype, aktivitet: '' as EAktivitet },
    ]);

    const antallMåneder =
        fraOgMedDato && tilOgMedDato
            ? differenceInMonths(new Date(tilOgMedDato), new Date(fraOgMedDato))
            : undefined;

    const lagBlankett = () => {
        settLaster(true);
        axiosRequest<string, IVedtak>({
            method: 'POST',
            url: `/familie-ef-sak/api/beregning/${behandlingId}/lagre-vedtak`,
            data: {
                resultatType: vedtaksresultatType,
                periodeBegrunnelse,
                inntektBegrunnelse,
            },
        })
            .then((res: Ressurs<string>) => {
                switch (res.status) {
                    case RessursStatus.SUKSESS:
                        history.push(`/behandling/${behandlingId}/blankett`);
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

    const VelgAktivitetsplikt = (periodetype: EPeriodetype | undefined) => {
        switch (periodetype) {
            case EPeriodetype.HOVEDPERIODE:
                return (
                    <StyledSelect
                        label="Aktivitet"
                        value={aktivitet}
                        onChange={(e) => {
                            settFeilmelding('');
                            settAktivitet(e.target.value as EAktivitet);
                        }}
                    >
                        <option value="">Velg</option>
                        <optgroup label="Ingen aktivitetsplikt">
                            <option value={EAktivitet.BARN_UNDER_ETT_ÅR}>Barn er under 1 år</option>
                        </optgroup>
                        <optgroup label="Fyller aktivitetsplikt">
                            <option value={EAktivitet.FORSØRGER_I_ARBEID}>
                                Forsørger er i arbeid (§15-6 første ledd)
                            </option>
                            <option value={EAktivitet.FORSØRGER_I_UTDANNING}>
                                Forsørger er i utdannings (§15-6 første ledd)
                            </option>
                            <option value={EAktivitet.FORSØRGER_REELL_ARBEIDSSØKER}>
                                Forsørger er reell arbeidssøker (§15-6 første ledd)
                            </option>
                            <option value={EAktivitet.FORSØRGER_ETABLERER_VIRKSOMHET}>
                                Forsørger etablerer egen virksomhet (§15-6 første ledd)
                            </option>
                        </optgroup>
                        <optgroup label="Fyller unntak for aktivitetsplikt">
                            <option value={EAktivitet.BARNET_SÆRLIG_TILSYNSKREVENDE}>
                                Barnet er særlig tilsynskrevende (§15-6 fjerde ledd)
                            </option>
                            <option value={EAktivitet.FORSØRGER_MANGLER_TILSYNSORDNING}>
                                Forsørger mangler tilsynsordning (§15-6 femte ledd)
                            </option>
                            <option value={EAktivitet.FORSØRGER_ER_SYK}>
                                Forsørger er syk (§15-6 femte ledd)
                            </option>
                            <option value={EAktivitet.BARNET_ER_SYKT}>
                                Barnet er sykt (§15-6 femte ledd)
                            </option>
                        </optgroup>
                    </StyledSelect>
                );
            case EPeriodetype.PERIODE_FØR_FØDSEL:
                return <TekstMedLabel label="Aktivitet" tekst="Ikke aktivitetsplikt" />;
            case undefined:
                return <TekstMedLabel label="Aktivitet" tekst="-" />;
        }
    };

    switch (vedtaksresultatType) {
        case EBehandlingResultat.INNVILGE:
            return (
                <>
                    <Element style={{ marginBottom: '1rem', marginTop: '3rem' }}>
                        Vedtaksperiode
                    </Element>
                    {vedtaksperiodeListe.map((element) => {
                        const { periodetype, aktivitet } = element;
                        return (
                            <VedtaksperiodeRad>
                                <StyledSelect
                                    label="Periodetype"
                                    value={periodetype}
                                    onChange={(e) => {
                                        settFeilmelding('');
                                        settPeriodetype(e.target.value as EPeriodetype);
                                    }}
                                >
                                    <option value="">Velg</option>
                                    <option value={EPeriodetype.PERIODE_FØR_FØDSEL}>
                                        Periode før fødsel
                                    </option>
                                    <option value={EPeriodetype.HOVEDPERIODE}>Hovedperiode</option>
                                </StyledSelect>
                                {VelgAktivitetsplikt(periodetype)}
                                <DatoPeriode
                                    datoFraTekst="Fra og med"
                                    datoTilTekst="Til og med"
                                    settDatoFra={settFraOgMedDato}
                                    settDatoTil={settTilOgMedDato}
                                    valgtDatoFra={fraOgMedDato}
                                    valgtDatoTil={tilOgMedDato}
                                    datoFeil={undefined}
                                />
                                {!!antallMåneder && (
                                    <Månedsdifferanse>{antallMåneder} måneder</Månedsdifferanse>
                                )}
                            </VedtaksperiodeRad>
                        );
                    })}
                    <Flatknapp>
                        <AddCircle style={{ marginRight: '1rem' }} />
                        Legg til vedtaksperiode
                    </Flatknapp>
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
