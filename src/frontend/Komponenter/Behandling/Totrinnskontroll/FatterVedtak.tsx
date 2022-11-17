import styled from 'styled-components';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import * as React from 'react';
import { FormEvent, useState } from 'react';
import { useApp } from '../../../App/context/AppContext';
import { BorderBox } from './Totrinnskontroll';
import { RessursStatus } from '@navikt/familie-typer';
import { useBehandling } from '../../../App/context/BehandlingContext';
import AlertStripeFeilPreWrap from '../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { EToast } from '../../../App/typer/toast';
import { Button, Radio, RadioGroup, Textarea } from '@navikt/ds-react';

const RadioButtonWrapper = styled.div`
    display: block;
    margin: 1rem;
`;

const SubmitButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
`;

const StyledForm = styled.form`
    padding: 0.25rem;

    .textarea__container {
        margin-bottom: 1rem;
    }
`;

const StyledUndertittel = styled(Undertittel)`
    margin: 0.5rem 0;
`;

const RadioMedPadding = styled(Radio)`
    padding-bottom: 4px;
`;

interface TotrinnskontrollForm {
    godkjent: boolean;
    begrunnelse?: string;
}

enum Totrinnsresultat {
    IKKE_VALGT = 'IKKE_VALGT',
    GODKJENT = 'GODKJENT',
    UNDERKJENT = 'UNDERKJENT',
}

const FatterVedtak: React.FC<{
    behandlingId: string;
    settVisGodkjentModal: (vis: boolean) => void;
}> = ({ behandlingId, settVisGodkjentModal }) => {
    const [godkjent, settGodkjent] = useState<Totrinnsresultat>(Totrinnsresultat.IKKE_VALGT);
    const [begrunnelse, settBegrunnelse] = useState<string>();
    const [feil, settFeil] = useState<string>();
    const [laster, settLaster] = useState<boolean>(false);
    const { axiosRequest, settToast, gåTilUrl } = useApp();
    const { hentBehandlingshistorikk, hentTotrinnskontroll } = useBehandling();
    const erUtfylt =
        godkjent === Totrinnsresultat.GODKJENT ||
        (godkjent === Totrinnsresultat.UNDERKJENT && (begrunnelse || '').length > 0);

    const fatteTotrinnsKontroll = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        settLaster(true);
        if (!erUtfylt) {
            return;
        }
        settFeil(undefined);
        axiosRequest<never, TotrinnskontrollForm>({
            method: 'POST',
            url: `/familie-ef-sak/api/vedtak/${behandlingId}/beslutte-vedtak`,
            data: {
                godkjent: godkjent === Totrinnsresultat.GODKJENT,
                begrunnelse,
            },
        })
            .then((response) => {
                if (response.status === RessursStatus.SUKSESS) {
                    if (godkjent) {
                        hentBehandlingshistorikk.rerun();
                        hentTotrinnskontroll.rerun();
                        settVisGodkjentModal(true);
                    } else {
                        settToast(EToast.VEDTAK_UNDERKJENT);
                        gåTilUrl('/oppgavebenk');
                    }
                } else {
                    settFeil(response.frontendFeilmeldingUtenFeilkode);
                }
            })
            .finally(() => settLaster(false));
    };

    return (
        <StyledForm onSubmit={fatteTotrinnsKontroll}>
            <BorderBox>
                <StyledUndertittel>Totrinnskontroll</StyledUndertittel>
                <Normaltekst>
                    Kontroller opplysninger og faglige vurderinger gjort under behandlingen
                </Normaltekst>
                <RadioButtonWrapper>
                    <RadioGroup legend={'Beslutt vedtak'} value={godkjent} hideLegend>
                        <RadioMedPadding
                            value={Totrinnsresultat.GODKJENT}
                            name="minRadioKnapp"
                            onChange={() => {
                                settGodkjent(Totrinnsresultat.GODKJENT);
                                settBegrunnelse(undefined);
                            }}
                        >
                            Godkjenn
                        </RadioMedPadding>
                        <RadioMedPadding
                            value={Totrinnsresultat.UNDERKJENT}
                            name="minRadioKnapp"
                            onChange={() => {
                                settGodkjent(Totrinnsresultat.UNDERKJENT);
                                settBegrunnelse(undefined);
                            }}
                        >
                            Underkjenn
                        </RadioMedPadding>
                    </RadioGroup>
                </RadioButtonWrapper>
                {godkjent === Totrinnsresultat.UNDERKJENT && (
                    <Textarea
                        value={begrunnelse || ''}
                        maxLength={0}
                        onChange={(e) => {
                            settBegrunnelse(e.target.value);
                        }}
                        label={'Begrunnelse'}
                        hideLabel
                    />
                )}
                {erUtfylt && (
                    <SubmitButtonWrapper>
                        <Button type="submit" disabled={laster}>
                            Fullfør
                        </Button>
                    </SubmitButtonWrapper>
                )}
                {feil && <AlertStripeFeilPreWrap>{feil}</AlertStripeFeilPreWrap>}
            </BorderBox>
        </StyledForm>
    );
};

export default FatterVedtak;
