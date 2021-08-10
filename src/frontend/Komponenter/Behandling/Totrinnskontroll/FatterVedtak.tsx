import styled from 'styled-components';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import * as React from 'react';
import { FormEvent, useState } from 'react';
import { Radio, Textarea } from 'nav-frontend-skjema';
import { Hovedknapp } from 'nav-frontend-knapper';
import { useApp } from '../../../App/context/AppContext';
import { BorderBox } from './Totrinnskontroll';
import { RessursStatus } from '@navikt/familie-typer';
import { ModalAction, ModalType, useModal } from '../../../App/context/ModalContext';
import { useBehandling } from '../../../App/context/BehandlingContext';
import AlertStripeFeilPreWrap from '../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';

const RadioButtonWrapper = styled.div`
    display: flex;
    justify-content: space-between;
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

interface TotrinnskontrollForm {
    godkjent: boolean;
    beskrivelse?: string;
}

const FatterVedtak: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const [godkjent, settGodkjent] = useState<boolean>();
    const [begrunnelse, settBegrunnelse] = useState<string>();
    const [feil, settFeil] = useState<string>();
    const [laster, settLaster] = useState<boolean>(false);
    const { modalDispatch } = useModal();

    const { axiosRequest } = useApp();
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
                    hentBehandlingshistorikk.rerun();
                    hentTotrinnskontroll.rerun();
                    modalDispatch({
                        type: ModalAction.VIS_MODAL,
                        modalType: godkjent
                            ? ModalType.VEDTAK_GODKJENT
                            : ModalType.VEDTAK_UNDERKJENT,
                    });
                } else {
                    settFeil(response.frontendFeilmelding);
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
                    <Radio
                        checked={godkjent === true}
                        label="Godkjenn"
                        name="minRadioKnapp"
                        onChange={() => {
                            settGodkjent(true);
                            settBegrunnelse(undefined);
                        }}
                    />
                    <Radio
                        checked={godkjent === false}
                        label="Underkjenn"
                        name="minRadioKnapp"
                        onChange={() => {
                            settGodkjent(false);
                            settBegrunnelse(undefined);
                        }}
                    />
                </RadioButtonWrapper>
                {godkjent === false && (
                    <Textarea
                        value={begrunnelse || ''}
                        maxLength={0}
                        onChange={(e) => {
                            settBegrunnelse(e.target.value);
                        }}
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
