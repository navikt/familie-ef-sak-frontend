import React, { Dispatch, SetStateAction } from 'react';
import MånedÅrVelger from '../../../../Felles/Input/MånedÅr/MånedÅrVelger';
import styled from 'styled-components';
import { AlertWarning } from '../../../../Felles/Visningskomponenter/Alerts';
import { EnsligErrorMessage } from '../../../../Felles/ErrorMessage/EnsligErrorMessage';
import { AGray50 } from '@navikt/ds-tokens/dist/tokens';
import { Stønadstype } from '../../../../App/typer/behandlingstema';

const Container = styled.div`
    padding: 1rem;
    background-color: ${AGray50};
`;

const Advarsel = styled(AlertWarning)`
    margin-top: 0.5rem;
    max-width: 60rem;
    .navds-alert__wrapper {
        max-width: 60rem;
    }
`;

const revurderesFørFørstePeriodeAdvarsel = (stønadstype: Stønadstype) => {
    const prefix =
        'Du har valgt å revurdere stønaden fra en måned det tidligere ikke er innvilget stønad for.';
    switch (stønadstype) {
        case Stønadstype.OVERGANGSSTØNAD:
            return `${prefix} Husk å fylle ut vedtaksperiode og inntekt for den nye perioden.`;
        case Stønadstype.BARNETILSYN:
            return `${prefix} Husk å fylle ut vedtaksperiode for den nye perioden.`;
        default:
            return '';
    }
};

export const RevurderesFraOgMed: React.FC<{
    className?: string;
    feilmelding: string | null;
    hentVedtakshistorikk: (revurderesFra: string) => void;
    revurderesFra: string | undefined;
    revurdererFraPeriodeUtenStønad: boolean;
    settRevurderesFra: Dispatch<SetStateAction<string | undefined>>;
    stønadstype: Stønadstype;
}> = ({
    className,
    feilmelding,
    hentVedtakshistorikk,
    revurderesFra,
    revurdererFraPeriodeUtenStønad,
    settRevurderesFra,
    stønadstype,
}) => {
    return (
        <Container className={className}>
            <MånedÅrVelger
                label={'Revurderes fra og med'}
                onEndret={(årMåned) => {
                    if (!årMåned) return;

                    settRevurderesFra(årMåned);
                    hentVedtakshistorikk(årMåned);
                }}
                antallÅrTilbake={5}
                antallÅrFrem={3}
                årMånedInitiell={revurderesFra}
            />
            <EnsligErrorMessage>{feilmelding}</EnsligErrorMessage>
            {revurdererFraPeriodeUtenStønad && (
                <Advarsel>{revurderesFørFørstePeriodeAdvarsel(stønadstype)}</Advarsel>
            )}
        </Container>
    );
};
