import { Textarea } from 'nav-frontend-skjema';
import React, { FormEvent } from 'react';
import styled from 'styled-components';
import { Hovedknapp as HovedKnappNAV } from 'nav-frontend-knapper';
import AlertStripeFeilPreWrap from '../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';

const StyledForm = styled.form`
    margin-top: 2rem;
`;

const StyledHovedKnapp = styled(HovedKnappNAV)`
    margin-top: 2rem;
`;

interface Props {
    lagBlankett: (e: FormEvent<HTMLFormElement>) => void;
    avslåBegrunnelse: string;
    settAvslåBegrunnelse: (begrunnelse: string) => void;
    laster: boolean;
    feilmelding?: string;
}

const AvslåVedtakForm: React.FC<Props> = ({
    lagBlankett,
    avslåBegrunnelse,
    settAvslåBegrunnelse,
    feilmelding,
    laster,
}) => {
    return (
        <>
            <StyledForm onSubmit={lagBlankett}>
                <Textarea
                    value={avslåBegrunnelse}
                    onChange={(e) => {
                        settAvslåBegrunnelse(e.target.value);
                    }}
                    label="Begrunnelse"
                    maxLength={0}
                />
                <StyledHovedKnapp htmlType="submit" disabled={laster}>
                    Lagre vedtak
                </StyledHovedKnapp>
            </StyledForm>
            {feilmelding && (
                <AlertStripeFeilPreWrap style={{ marginTop: '2rem' }}>
                    {feilmelding}
                </AlertStripeFeilPreWrap>
            )}
        </>
    );
};

export default AvslåVedtakForm;
