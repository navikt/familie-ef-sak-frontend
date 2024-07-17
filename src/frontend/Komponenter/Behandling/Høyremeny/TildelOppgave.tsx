import React, { useEffect } from 'react';
import { useHentOppgave } from '../../../App/hooks/useHentOppgave';
import { Alert, Button } from '@navikt/ds-react';
import { useOppgave } from '../../../App/hooks/useOppgave';
import { ABorderSubtle } from '@navikt/ds-tokens/dist/tokens';
import styled from 'styled-components';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';
import { useApp } from '../../../App/context/AppContext';
import { useToggles } from '../../../App/context/TogglesContext';
import { ToggleName } from '../../../App/context/toggles';

const Container = styled.div`
    border: 1px solid ${ABorderSubtle};
    padding: 0.5rem 1rem;
    margin: 1rem 0.5rem;
    border-radius: 0.125rem;

    & > *:not(:first-child) {
        margin-top: 1rem;
    }
`;

const TildelOppgave: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { innloggetSaksbehandler } = useApp();
    const { hentOppgave, oppgave, laster, feilmelding } = useHentOppgave(behandlingId);
    const { settOppgaveTilSaksbehandler } = useOppgave(oppgave);
    const { toggles } = useToggles();

    const erTilordnetOgInnloggetSaksbehandlerDenSamme =
        oppgave?.tilordnetRessurs === innloggetSaksbehandler.navIdent;
    const erIkkeTogglet = !toggles[ToggleName.visTildelOppgaveKnapp];

    useEffect(() => {
        hentOppgave();
    }, [behandlingId, hentOppgave]);

    const handleTildelOppgave = () => {
        settOppgaveTilSaksbehandler();
        window.location.reload();
    };

    if (erIkkeTogglet || laster || erTilordnetOgInnloggetSaksbehandlerDenSamme) {
        return null;
    }

    return (
        <Container>
            <BodyShortSmall>KUN PREPROD - Overta oppgaven</BodyShortSmall>
            <Button size="small" onClick={handleTildelOppgave}>
                Tildel oppgave
            </Button>
            {feilmelding && (
                <Alert size="small" variant={'error'}>
                    {feilmelding}
                </Alert>
            )}
        </Container>
    );
};

export default TildelOppgave;
