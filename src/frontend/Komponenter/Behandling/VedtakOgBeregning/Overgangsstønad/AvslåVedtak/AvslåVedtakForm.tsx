import React, { FormEvent, useEffect } from 'react';
import styled from 'styled-components';
import { Hovedknapp as HovedKnappNAV } from 'nav-frontend-knapper';
import AlertStripeFeilPreWrap from '../../../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { EnsligTextArea } from '../../../../../Felles/Input/TekstInput/EnsligTextArea';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import { useApp } from '../../../../../App/context/AppContext';
import SelectAvslagÅrsak from './SelectAvslagÅrsak';
import { EAvslagÅrsak } from '../../../../../App/typer/vedtak';

const StyledForm = styled.form`
    margin-top: 2rem;
`;

const StyledHovedKnapp = styled(HovedKnappNAV)`
    margin-top: 2rem;
`;

interface Props {
    avslagÅrsak?: EAvslagÅrsak;
    settAvslagÅrsak: (årsak: EAvslagÅrsak) => void;
    lagreVedtak: (e: FormEvent<HTMLFormElement>) => void;
    avslagBegrunnelse: string;
    settAvslagBegrunnelse: (begrunnelse: string) => void;
    laster: boolean;
    feilmelding?: string;
    behandlingErRedigerbar: boolean;
    feilmeldingÅrsak: string;
    skalVelgeÅrsak: boolean;
}

const AvslåVedtakForm: React.FC<Props> = ({
    avslagÅrsak,
    settAvslagÅrsak,
    lagreVedtak,
    avslagBegrunnelse,
    settAvslagBegrunnelse,
    feilmelding,
    laster,
    behandlingErRedigerbar,
    feilmeldingÅrsak,
    skalVelgeÅrsak,
}) => {
    const { settIkkePersistertKomponent } = useApp();

    useEffect(() => {
        !skalVelgeÅrsak && settAvslagÅrsak(EAvslagÅrsak.VILKÅR_IKKE_OPPFYLT);
    }, [skalVelgeÅrsak, settAvslagÅrsak]);

    return (
        <>
            <StyledForm onSubmit={lagreVedtak}>
                {skalVelgeÅrsak && (
                    <SelectAvslagÅrsak
                        avslagÅrsak={avslagÅrsak}
                        settAvslagÅrsak={settAvslagÅrsak}
                        feilmelding={feilmeldingÅrsak}
                    />
                )}
                <EnsligTextArea
                    value={avslagBegrunnelse}
                    onChange={(e) => {
                        settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                        settAvslagBegrunnelse(e.target.value);
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
