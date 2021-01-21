import styled from 'styled-components';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import * as React from 'react';
import { FormEvent, useState } from 'react';
import { Radio, Textarea } from 'nav-frontend-skjema';
import { Hovedknapp } from 'nav-frontend-knapper';
import { useApp } from '../../../context/AppContext';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';

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

const BorderBox = styled.div`
    border: 1px solid #c6c2bf;
    padding: 0.5rem 1rem;
    border-radius: 0.125rem;
`;

interface TotrinnskontrollForm {
    godkjent: boolean;
    beskrivelse?: string;
}

const FattarVedtak: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const [godkjent, settGodkjent] = useState<boolean>();
    const [begrunnelse, settBegrunnelse] = useState<string>();
    const [feil, settFeil] = useState<string>();

    const { axiosCustomRequest } = useApp();
    const erUtfylt = godkjent === true || (godkjent === false && (begrunnelse || '').length > 0);

    const fatteTotrinnsKontroll = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!erUtfylt) {
            return;
        }
        axiosCustomRequest<never, TotrinnskontrollForm>(
            {
                method: 'POST',
                url: `/familie-ef-sak/api/vedtak/${behandlingId}/beslutte-vedtak`,
                data: {
                    godkjent: !!godkjent,
                    begrunnelse,
                },
            },
            (er) => settFeil(er.frontendFeilmelding),
            () => {
                // TODO vis modal
                alert('Vedtak er lagret');
            }
        );
    };

    return (
        <StyledForm onSubmit={fatteTotrinnsKontroll}>
            <BorderBox>
                <StyledUndertittel>To-trinnskontroll</StyledUndertittel>
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
                        <Hovedknapp htmlType="submit">Fullfør</Hovedknapp>
                    </SubmitButtonWrapper>
                )}
                {feil && <AlertStripeFeil>Lagring feilet: {feil}</AlertStripeFeil>}
            </BorderBox>
        </StyledForm>
    );
};

export default FattarVedtak;
