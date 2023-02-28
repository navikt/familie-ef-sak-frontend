import React, { FormEvent, useEffect } from 'react';
import styled from 'styled-components';
import AlertStripeFeilPreWrap from '../../../../../Felles/Visningskomponenter/AlertStripeFeilPreWrap';
import { EnsligTextArea } from '../../../../../Felles/Input/TekstInput/EnsligTextArea';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import { useApp } from '../../../../../App/context/AppContext';
import SelectAvslagÅrsak from './SelectAvslagÅrsak';
import { EAvslagÅrsak } from '../../../../../App/typer/vedtak';
import { Button } from '@navikt/ds-react';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';

const HovedKnapp = styled(Button)`
    margin-top: 1rem;
`;

const Container = styled.div<{ erOvergangsstønad: boolean }>`
    margin-top: 1rem;
    padding: ${(props) => (props.erOvergangsstønad ? '0.4rem 1rem 1rem 1rem' : '1rem')};
    background-color: ${AGray50};
`;

interface Props {
    avslagBegrunnelse: string;
    avslagÅrsak?: EAvslagÅrsak;
    behandlingErRedigerbar: boolean;
    erOvergangsstønad: boolean;
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
    erOvergangsstønad,
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
        <>
            <form onSubmit={lagreVedtak}>
                <Container erOvergangsstønad={erOvergangsstønad}>
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
                </Container>
                {behandlingErRedigerbar && (
                    <HovedKnapp type="submit" disabled={laster}>
                        Lagre vedtak
                    </HovedKnapp>
                )}
            </form>
            {feilmelding && (
                <AlertStripeFeilPreWrap style={{ marginTop: '2rem' }}>
                    {feilmelding}
                </AlertStripeFeilPreWrap>
            )}
        </>
    );
};

export default AvslåVedtakForm;
