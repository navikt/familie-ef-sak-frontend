import styled from 'styled-components';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { FormEvent, useState } from 'react';
import { Radio, Textarea } from 'nav-frontend-skjema';
import { Hovedknapp } from 'nav-frontend-knapper';
import * as React from 'react';
import { useApp } from '../../../context/AppContext';

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
    const [utfall, settUtfall] = useState<string>();
    const [begrunnelse, settBegrunnelse] = useState<string>('');

    const { axiosCustomRequest } = useApp();

    const fatteTotrinnsKontroll = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axiosCustomRequest<never, TotrinnskontrollForm>(
            {
                method: 'POST',
                url: `/familie-ef-sak/api/vedtak/${behandlingId}/beslutte-vedtak`,
                data: Object.assign(
                    { godkjent: utfall === 'Godkjent' },
                    utfall === 'Underkjent' && { c: 2 }
                ),
            },
            (d) => console.log(d),
            (er) => console.error(er)
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
                        checked={utfall === 'Godkjent'}
                        label="Godkjenn"
                        name="minRadioKnapp"
                        onChange={() => {
                            settUtfall('Godkjent');
                            settBegrunnelse('');
                        }}
                    />
                    <Radio
                        checked={utfall === 'Underkjent'}
                        label="Underkjenn"
                        name="minRadioKnapp"
                        onChange={() => {
                            settUtfall('Underkjent');
                            settBegrunnelse('');
                        }}
                    />
                </RadioButtonWrapper>
                {utfall === 'Underkjent' && (
                    <Textarea
                        value={begrunnelse}
                        maxLength={0}
                        onChange={(e) => {
                            settBegrunnelse(e.target.value);
                        }}
                    />
                )}
                {utfall && (
                    <SubmitButtonWrapper>
                        <Hovedknapp htmlType="submit">Fullfør</Hovedknapp>
                    </SubmitButtonWrapper>
                )}
            </BorderBox>
        </StyledForm>
    );
};

export default FattarVedtak;
