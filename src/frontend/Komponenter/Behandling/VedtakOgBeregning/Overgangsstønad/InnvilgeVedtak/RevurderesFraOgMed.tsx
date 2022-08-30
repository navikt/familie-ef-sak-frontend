import React, { Dispatch, SetStateAction } from 'react';
import MånedÅrVelger from '../../../../../Felles/Input/MånedÅr/MånedÅrVelger';
import styled from 'styled-components';
import { SkjemaelementFeilmelding } from 'nav-frontend-skjema';
import { IVedtakshistorikk } from '../../../../../App/typer/vedtak';
import { revurdererFørFørstePeriode } from './revurderFraUtils';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';

const WrapperMarginBottom = styled.div`
    margin-bottom: 2rem;
`;

const Advarsel = styled(AlertStripeAdvarsel)`
    margin-top: 0.5rem;
    max-width: 60rem;
    .alertstripe__tekst {
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
            {feilmelding && <SkjemaelementFeilmelding>{feilmelding}</SkjemaelementFeilmelding>}
            {revurdererFørFørstePeriode(vedtakshistorikk, revurderesFra) && (
                <Advarsel>
                    Fom-datoen for denne revurderingen er før fom-datoen for tidligere vedtak. Husk
                    å fylle ut vedtaksperiode og inntekt for den nye perioden.
                </Advarsel>
            )}
        </WrapperMarginBottom>
    );
};
