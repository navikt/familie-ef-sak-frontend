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
import { Behandling, BehandlingResultat } from '../../../App/typer/fagsak';
import { useNavigate } from 'react-router-dom';
import { useBehandling } from '../../../App/context/BehandlingContext';

const Container = styled.div`
    border: 1px solid ${ABorderSubtle};
    padding: 0.5rem 1rem;
    margin: 1rem 0.5rem;
    border-radius: 0.125rem;

    & > *:not(:first-child) {
        margin-top: 1rem;
    }
`;

const TildelOppgave: React.FC<{ behandling: Behandling }> = ({ behandling }) => {
    const { id: behandlingId, resultat, opprettet } = behandling;
    const { innloggetSaksbehandler } = useApp();
    const { hentOppgave, oppgave, laster, feilmelding } = useHentOppgave(behandlingId);
    const { settOppgaveTilSaksbehandler } = useOppgave(oppgave);
    const { toggles } = useToggles();
    const navigate = useNavigate();
    const [harTildetOppgave, settHarTildetOppgave] = React.useState<boolean>(false);
    const { hentAnsvarligSaksbehandler } = useBehandling();

    const erTilordnetOgInnloggetSaksbehandlerDenSamme =
        oppgave?.tilordnetRessurs === innloggetSaksbehandler.navIdent;
    const erIkkeTogglet = !toggles[ToggleName.visTildelOppgaveKnapp];
    const erBehandlingFortsattAktiv =
        resultat === BehandlingResultat.IKKE_SATT || resultat === BehandlingResultat.AVSLÅTT;

    const handleTildelOppgave = () => {
        settOppgaveTilSaksbehandler()
            .then(() => {
                hentAnsvarligSaksbehandler.rerun();
                settHarTildetOppgave(true);
                navigate(`/behandling/${behandlingId}/arsak-revurdering`);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const sjekkOmDetHarGåttMistEttMinuttSidenBehandlingenBleOpprettet = (
        opprettet: string
    ): boolean => {
        const opprettetDate = new Date(opprettet);
        const nå = new Date();
        const ettMinutt = 60 * 1000;
        return nå.getTime() - opprettetDate.getTime() > ettMinutt;
    };

    const erBehandlingOpprettetForMerEnnEttMinuttSiden =
        sjekkOmDetHarGåttMistEttMinuttSidenBehandlingenBleOpprettet(opprettet);

    useEffect(() => {
        if (erBehandlingFortsattAktiv) {
            hentOppgave();
        }
    }, [behandlingId, erBehandlingFortsattAktiv, hentOppgave]);

    if (
        harTildetOppgave ||
        erIkkeTogglet ||
        laster ||
        erTilordnetOgInnloggetSaksbehandlerDenSamme ||
        !erBehandlingFortsattAktiv ||
        !erBehandlingOpprettetForMerEnnEttMinuttSiden
    ) {
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
