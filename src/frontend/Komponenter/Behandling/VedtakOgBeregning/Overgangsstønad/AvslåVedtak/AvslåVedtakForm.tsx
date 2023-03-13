import React, { FormEvent, useEffect } from 'react';
import styled from 'styled-components';
import AlertStripeFeilPreWrap from '../../../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { EnsligTextArea } from '../../../../../Felles/Input/TekstInput/EnsligTextArea';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import { useApp } from '../../../../../App/context/AppContext';
import SelectAvslagÅrsak from './SelectAvslagÅrsak';
import { EAvslagÅrsak } from '../../../../../App/typer/vedtak';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';
import HovedKnapp from '../../../../../Felles/Knapper/HovedKnapp';

const Form = styled.form`
    background-color: ${AGray50};
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

interface Props {
    avslagBegrunnelse: string;
    avslagÅrsak?: EAvslagÅrsak;
    behandlingErRedigerbar: boolean;
    feilmelding?: string;
    feilmeldingÅrsak: string;
    lagreVedtak: (e: FormEvent<HTMLFormElement>) => void;
    laster: boolean;
    settAvslagBegrunnelse: (begrunnelse: string) => void;
    settAvslagÅrsak: (årsak: EAvslagÅrsak) => void;
    skalVelgeÅrsak: boolean;
}

const AvslåVedtakForm: React.FC<Props> = ({
    avslagBegrunnelse,
    avslagÅrsak,
    behandlingErRedigerbar,
    feilmelding,
    feilmeldingÅrsak,
    lagreVedtak,
    laster,
    settAvslagBegrunnelse,
    settAvslagÅrsak,
    skalVelgeÅrsak,
}) => {
    const { settIkkePersistertKomponent } = useApp();

    useEffect(() => {
        !skalVelgeÅrsak && settAvslagÅrsak(EAvslagÅrsak.VILKÅR_IKKE_OPPFYLT);
    }, [skalVelgeÅrsak, settAvslagÅrsak]);

    return (
        <Form onSubmit={lagreVedtak}>
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
            {feilmelding && <AlertStripeFeilPreWrap>{feilmelding}</AlertStripeFeilPreWrap>}
            {behandlingErRedigerbar && <HovedKnapp disabled={laster} knappetekst="Lagre vedtak" />}
        </Form>
    );
};

export default AvslåVedtakForm;
