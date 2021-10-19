import React, { FormEvent } from 'react';
import styled from 'styled-components';
import { Hovedknapp as HovedKnappNAV } from 'nav-frontend-knapper';
import AlertStripeFeilPreWrap from '../../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { EnsligTextArea } from '../../../../Felles/Input/TekstInput/EnsligTextArea';
import { VEDTAK_OG_BEREGNING } from '../konstanter';
import { useApp } from '../../../../App/context/AppContext';

const StyledForm = styled.form`
    margin-top: 2rem;
`;

const StyledHovedKnapp = styled(HovedKnappNAV)`
    margin-top: 2rem;
`;

interface Props {
    lagreVedtak: (e: FormEvent<HTMLFormElement>) => void;
    avslåBegrunnelse: string;
    settAvslåBegrunnelse: (begrunnelse: string) => void;
    laster: boolean;
    feilmelding?: string;
    behandlingErRedigerbar: boolean;
}

const AvslåVedtakForm: React.FC<Props> = ({
    lagreVedtak,
    avslåBegrunnelse,
    settAvslåBegrunnelse,
    feilmelding,
    laster,
    behandlingErRedigerbar,
}) => {
    const { settIkkePersistertKomponent } = useApp();

    return (
        <>
            <StyledForm onSubmit={lagreVedtak}>
                <EnsligTextArea
                    value={avslåBegrunnelse}
                    onChange={(e) => {
                        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                        settAvslåBegrunnelse(e.target.value);
                    }}
                    label="Begrunnelse"
                    maxLength={0}
                    erLesevisning={!behandlingErRedigerbar}
                />
                <StyledHovedKnapp
                    htmlType="submit"
                    disabled={laster}
                    hidden={!behandlingErRedigerbar}
                >
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
