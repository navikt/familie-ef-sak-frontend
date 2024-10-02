import React from 'react';
import { Alert, VStack } from '@navikt/ds-react';

interface Props {
    harÅpenKlage: boolean;
    kanOppretteRevurdering: boolean;
    harKunHenlagteBehandlinger: boolean;
}

export const ModalAlerts: React.FC<Props> = ({
    harÅpenKlage,
    kanOppretteRevurdering,
    harKunHenlagteBehandlinger,
}) => {
    return (
        <VStack gap="4">
            {!kanOppretteRevurdering && !harKunHenlagteBehandlinger && (
                <Alert variant={'info'}>
                    Merk at det er ikke mulig å opprette en revurdering da det allerede finnes en
                    åpen behandling for stønaden. Det er kun mulig å opprette tilbakekreving (dersom
                    det foreligger et kravgrunnlag) eller klage.
                </Alert>
            )}
            {!kanOppretteRevurdering && harKunHenlagteBehandlinger && (
                <Alert variant={'info'}>
                    Merk at det er ikke mulig å opprette en revurdering da det ikke finnes en
                    førstegangsbehandling for stønaden.
                </Alert>
            )}
            {harÅpenKlage && (
                <Alert variant={'info'}>
                    Merk at det allerede finnes en åpen klagebehandling på fagsaken
                </Alert>
            )}
        </VStack>
    );
};
