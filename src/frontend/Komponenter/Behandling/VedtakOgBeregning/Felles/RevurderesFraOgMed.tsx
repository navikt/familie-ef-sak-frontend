import React, { Dispatch, SetStateAction } from 'react';
import MånedÅrVelger from '../../../../Felles/Input/MånedÅr/MånedÅrVelger';
import styled from 'styled-components';
import { AlertWarning } from '../../../../Felles/Visningskomponenter/Alerts';
import { EnsligErrorMessage } from '../../../../Felles/ErrorMessage/EnsligErrorMessage';

const Advarsel = styled(AlertWarning)`
    margin-top: 0.5rem;
    max-width: 60rem;
    .navds-alert__wrapper {
        max-width: 60rem;
    }
`;

type Type = 'OVERGANGSSTØNAD' | 'BARNETILSYN';

const revurderesFørFørstePeriodeAdvarsel = (type: Type) => {
    const prefix =
        'Du har valgt å revurdere stønaden fra en måned det tidligere ikke er innvilget stønad for.';
    switch (type) {
        case 'OVERGANGSSTØNAD':
            return `${prefix} Husk å fylle ut vedtaksperiode og inntekt for den nye perioden.`;
        case 'BARNETILSYN':
            return `${prefix} Husk å fylle ut vedtaksperiode for den nye perioden.`;
    }
};

export const RevurderesFraOgMed: React.FC<{
    className?: string;
    feilmelding: string | null;
    revurderesFra: string | undefined;
    revurdererFraPeriodeUtenStønad: boolean;
    settRevurderesFra: Dispatch<SetStateAction<string | undefined>>;
    type: Type;
}> = ({
    className,
    settRevurderesFra,
    revurderesFra,
    feilmelding,
    revurdererFraPeriodeUtenStønad,
    type,
}) => {
    return (
        <div className={className}>
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
            {revurdererFraPeriodeUtenStønad && (
                <Advarsel>{revurderesFørFørstePeriodeAdvarsel(type)}</Advarsel>
            )}
        </div>
    );
};
