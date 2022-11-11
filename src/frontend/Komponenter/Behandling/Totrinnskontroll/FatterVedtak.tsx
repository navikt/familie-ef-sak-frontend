import styled from 'styled-components';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import * as React from 'react';
import { FormEvent, useState } from 'react';
import { Hovedknapp } from 'nav-frontend-knapper';
import { useApp } from '../../../App/context/AppContext';
import { BorderBox } from './Totrinnskontroll';
import { RessursStatus } from '@navikt/familie-typer';
import { useBehandling } from '../../../App/context/BehandlingContext';
import AlertStripeFeilPreWrap from '../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { EToast } from '../../../App/typer/toast';
import { Radio, Textarea } from '@navikt/ds-react';

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

const FatterVedtak: React.FC<{
    behandlingId: string;
    settVisGodkjentModal: (vis: boolean) => void;
}> = ({ behandlingId, settVisGodkjentModal }) => {
    const [godkjent, settGodkjent] = useState<boolean>();
    const [begrunnelse, settBegrunnelse] = useState<string>();
    const [feil, settFeil] = useState<string>();
    const [laster, settLaster] = useState<boolean>(false);
    const { axiosRequest, settToast, gåTilUrl } = useApp();
    const { hentBehandlingshistorikk, hentTotrinnskontroll } = useBehandling();
    const erUtfylt = godkjent === true || (godkjent === false && (begrunnelse || '').length > 0);

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
                godkjent: !!godkjent,
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
                    <RadioMedPadding
                        value={true}
                        checked={godkjent === true}
                        name="minRadioKnapp"
                        onChange={() => {
                            settGodkjent(true);
                            settBegrunnelse(undefined);
                        }}
                    >
                        Godkjenn
                    </RadioMedPadding>
                    <RadioMedPadding
                        checked={godkjent === false}
                        value={false}
                        name="minRadioKnapp"
                        onChange={() => {
                            settGodkjent(false);
                            settBegrunnelse(undefined);
                        }}
                    >
                        Underkjenn
                    </RadioMedPadding>
                </RadioButtonWrapper>
                {godkjent === false && (
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
                        <Hovedknapp htmlType="submit" disabled={laster}>
                            Fullfør
                        </Hovedknapp>
                    </SubmitButtonWrapper>
                )}
                {feil && <AlertStripeFeilPreWrap>{feil}</AlertStripeFeilPreWrap>}
            </BorderBox>
        </StyledForm>
    );
};

export default FatterVedtak;
