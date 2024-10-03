import styled from 'styled-components';
import * as React from 'react';
import { FormEvent, useState, useCallback, useEffect } from 'react';
import { useApp } from '../../../App/context/AppContext';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { AlertError, AlertWarning } from '../../../Felles/Visningskomponenter/Alerts';
import { EToast } from '../../../App/typer/toast';
import {
    Button,
    Checkbox,
    CheckboxGroup,
    Heading,
    Radio,
    RadioGroup,
    Textarea,
} from '@navikt/ds-react';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';
import { ÅrsakUnderkjent, årsakUnderkjentTilTekst } from '../../../App/typer/totrinnskontroll';
import { useNavigate } from 'react-router-dom';
import { RessursStatus } from '../../../App/typer/ressurs';
import { Behandling } from '../../../App/typer/fagsak';
import { ABorderSubtle } from '@navikt/ds-tokens/dist/tokens';
import { harVedtaksresultatMedTilkjentYtelse } from '../../../App/hooks/useHentVedtak';
import { Steg } from '../Høyremeny/Steg';

const SubmitButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const Container = styled.div`
    border: 1px solid ${ABorderSubtle};
    margin: 1rem 0.5rem;
    padding: 1rem;
    border-radius: 0.125rem;

    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

interface TotrinnskontrollForm {
    godkjent: boolean;
    begrunnelse?: string;
    årsakerUnderkjent: ÅrsakUnderkjent[];
}

enum Totrinnsresultat {
    IKKE_VALGT = 'IKKE_VALGT',
    GODKJENT = 'GODKJENT',
    UNDERKJENT = 'UNDERKJENT',
}

const FatterVedtak: React.FC<{
    behandling: Behandling;
    settVisGodkjentModal: (vis: boolean) => void;
}> = ({ behandling, settVisGodkjentModal }) => {
    const [totrinnsresultat, settTotrinnsresultat] = useState<Totrinnsresultat>(
        Totrinnsresultat.IKKE_VALGT
    );
    const [årsakerUnderkjent, settÅrsakerUnderkjent] = useState<ÅrsakUnderkjent[]>([]);
    const [begrunnelse, settBegrunnelse] = useState<string>();
    const [feil, settFeil] = useState<string>();
    const [laster, settLaster] = useState<boolean>(false);
    const [erSimuleringsresultatEndret, settErSimuleringsresultatEndret] = useState<boolean>(false);

    const { axiosRequest, settToast } = useApp();
    const {
        hentBehandlingshistorikk,
        hentTotrinnskontroll,
        hentVedtak,
        vedtaksresultat,
        hentAnsvarligSaksbehandler,
    } = useBehandling();

    const navigate = useNavigate();

    const hentSammenlignSimuleringsresultater = useCallback(
        (behandlingId: string) => {
            axiosRequest<boolean, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/simulering/simuleringsresultat-er-endret/${behandlingId}`,
            }).then((respons) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    settErSimuleringsresultatEndret(respons.data);
                }
            });
        },
        [axiosRequest]
    );

    useEffect(() => {
        if (
            harVedtaksresultatMedTilkjentYtelse(vedtaksresultat) &&
            behandling.steg === Steg.BESLUTTE_VEDTAK
        ) {
            hentSammenlignSimuleringsresultater(behandling.id);
        }
    }, [vedtaksresultat, hentSammenlignSimuleringsresultater, behandling.id, behandling.steg]);

    const erUtfylt =
        totrinnsresultat === Totrinnsresultat.GODKJENT ||
        (totrinnsresultat === Totrinnsresultat.UNDERKJENT &&
            (begrunnelse || '').length > 0 &&
            årsakerUnderkjent.length > 0);

    const fatteTotrinnsKontroll = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        settLaster(true);
        if (!erUtfylt) {
            return;
        }
        settFeil(undefined);
        axiosRequest<never, TotrinnskontrollForm>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandling.id}/beslutte-vedtak`,
            data: {
                godkjent: totrinnsresultat === Totrinnsresultat.GODKJENT,
                begrunnelse,
                årsakerUnderkjent,
            },
        })
            .then((response) => {
                if (response.status === RessursStatus.SUKSESS) {
                    if (totrinnsresultat === Totrinnsresultat.GODKJENT) {
                        hentBehandlingshistorikk.rerun();
                        hentVedtak.rerun();
                        hentTotrinnskontroll.rerun();
                        hentAnsvarligSaksbehandler.rerun();
                        settVisGodkjentModal(true);
                    } else {
                        settToast(EToast.VEDTAK_UNDERKJENT);
                        navigate('/oppgavebenk');
                    }
                } else {
                    settFeil(response.frontendFeilmeldingUtenFeilkode);
                }
            })
            .finally(() => settLaster(false));
    };

    return (
        <form onSubmit={fatteTotrinnsKontroll}>
            <Container>
                {erSimuleringsresultatEndret && (
                    <AlertWarning>
                        Det har skjedd en endring i feilutbetaling ved simulering mot oppdrag etter
                        at vedtaket ble sendt til godkjenning. Underkjenn derfor vedtaket slik at
                        saksbehandler kan ta stilling til om endringene påvirker vedtaket.
                    </AlertWarning>
                )}
                <div>
                    <Heading size={'small'} level={'3'}>
                        Totrinnskontroll
                    </Heading>
                    <BodyShortSmall>
                        Kontroller opplysninger og faglige vurderinger gjort under behandlingen
                    </BodyShortSmall>
                    <RadioGroup legend={'Beslutt vedtak'} value={totrinnsresultat} hideLegend>
                        <Radio
                            value={Totrinnsresultat.GODKJENT}
                            name="minRadioKnapp"
                            onChange={() => {
                                settTotrinnsresultat(Totrinnsresultat.GODKJENT);
                                settBegrunnelse(undefined);
                                settÅrsakerUnderkjent([]);
                            }}
                        >
                            Godkjenn
                        </Radio>
                        <Radio
                            value={Totrinnsresultat.UNDERKJENT}
                            name="minRadioKnapp"
                            onChange={() => {
                                settTotrinnsresultat(Totrinnsresultat.UNDERKJENT);
                                settBegrunnelse(undefined);
                            }}
                        >
                            Underkjenn
                        </Radio>
                    </RadioGroup>
                </div>
                {totrinnsresultat === Totrinnsresultat.UNDERKJENT && (
                    <>
                        <CheckboxGroup
                            legend={'Årsak til underkjennelse'}
                            description={'Manglende eller feil opplysninger om:'}
                            value={årsakerUnderkjent}
                            onChange={settÅrsakerUnderkjent}
                        >
                            {Object.values(ÅrsakUnderkjent).map((årsak) => (
                                <Checkbox key={årsak} value={årsak}>
                                    {årsakUnderkjentTilTekst[årsak]}
                                </Checkbox>
                            ))}
                        </CheckboxGroup>
                        <Textarea
                            value={begrunnelse || ''}
                            maxLength={0}
                            onChange={(e) => {
                                settBegrunnelse(e.target.value);
                            }}
                            label={'Begrunnelse'}
                        />
                    </>
                )}
                {erUtfylt && (
                    <SubmitButtonWrapper>
                        <Button type="submit" disabled={laster}>
                            Fullfør
                        </Button>
                    </SubmitButtonWrapper>
                )}
                {feil && <AlertError>{feil}</AlertError>}
            </Container>
        </form>
    );
};

export default FatterVedtak;
