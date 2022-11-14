import React, { Dispatch, SetStateAction } from 'react';
import MånedÅrVelger from '../../../../../Felles/Input/MånedÅr/MånedÅrVelger';
import styled from 'styled-components';
import { IVedtakshistorikk } from '../../../../../App/typer/vedtak';
import { revurdererFørFørstePeriode } from './revurderFraUtils';
import { AlertWarning } from '../../../../../Felles/Visningskomponenter/Alerts';
import { EnsligErrorMessage } from '../../../../../Felles/ErrorMessage/EnsligErrorMessage';

const WrapperMarginBottom = styled.div`
    margin-bottom: 2rem;
`;

const Advarsel = styled(AlertWarning)`
    margin-top: 0.5rem;
    max-width: 60rem;
    .navds-alert__wrapper {
        max-width: 60rem;
    }
`;

export const RevurderesFraOgMed: React.FC<{
    settRevurderesFra: Dispatch<SetStateAction<string | undefined>>;
    revurderesFra: string | undefined;
    feilmelding: string | null;
    vedtakshistorikk: IVedtakshistorikk | undefined;
}> = ({ settRevurderesFra, revurderesFra, feilmelding, vedtakshistorikk }) => {
    return (
        <WrapperMarginBottom>
            <MånedÅrVelger
                label={'Revurderes fra og med'}
                onEndret={(årMåned) => {
                    if (!årMåned) return;

                    settRevurderesFra(årMåned);
                }}
                antallÅrTilbake={5}
                antallÅrFrem={3}
                årMånedInitiell={revurderesFra}
            />
            <EnsligErrorMessage>{feilmelding}</EnsligErrorMessage>
            {revurdererFørFørstePeriode(vedtakshistorikk, revurderesFra) && (
                <Advarsel>
                    Fom-datoen for denne revurderingen er før fom-datoen for tidligere vedtak. Husk
                    å fylle ut vedtaksperiode og inntekt for den nye perioden.
                </Advarsel>
            )}
        </WrapperMarginBottom>
    );
};
