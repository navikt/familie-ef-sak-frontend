import React, { FC } from 'react';
import { Heading } from '@navikt/ds-react';
import { VEDTAK_OG_BEREGNING } from '../../Felles/konstanter';
import styled from 'styled-components';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';
import { useBehandling } from '../../../../../App/context/BehandlingContext';
import { FieldState } from '../../../../../App/hooks/felles/useFieldState';
import { useApp } from '../../../../../App/context/AppContext';
import { InnvilgeVedtakForm } from './typer';
import { FormErrors } from '../../../../../App/hooks/felles/useFormState';
import { EnsligTextArea } from '../../../../../Felles/Input/TekstInput/EnsligTextArea';

interface Props {
    begrunnelseState: FieldState;
    errorState: FormErrors<InnvilgeVedtakForm>;
}

const Container = styled.div`
    padding: 1rem;
    background-color: ${AGray50};
`;

export const BegrunnelsesFelt: FC<Props> = ({ begrunnelseState, errorState }) => {
    const { settIkkePersistertKomponent } = useApp();
    const { behandlingErRedigerbar } = useBehandling();

    return (
        <Container>
            <Heading spacing size="small" level="5">
                Utgifter til skolepenger
            </Heading>
            <EnsligTextArea
                label={'Begrunnelse'}
                maxLength={0}
                feilmelding={errorState.begrunnelse}
                readOnly={!behandlingErRedigerbar}
                value={begrunnelseState.value}
                onChange={(event) => {
                    settIkkePersistertKomponent(VEDTAK_OG_BEREGNING);
                    begrunnelseState.onChange(event);
                }}
            />
        </Container>
    );
};
