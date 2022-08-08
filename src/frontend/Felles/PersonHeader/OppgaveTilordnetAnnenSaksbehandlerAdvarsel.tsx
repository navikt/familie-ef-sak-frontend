import * as React from 'react';
import styled from 'styled-components';
import { BodyShort, Button, HelpText, Label } from '@navikt/ds-react';
import { EtikettInfo } from 'nav-frontend-etiketter';
import { Close } from '@navikt/ds-icons';
import { Behandling } from '../../App/typer/fagsak';
import { ISaksbehandler } from '../../App/typer/saksbehandler';
import { erBehandlingRedigerbar } from '../../App/typer/behandlingstatus';
import { useState } from 'react';

const AdvarselEtikett = styled(EtikettInfo)<{ åpenHøyreMeny?: boolean }>`
    position: absolute;
    top: 5rem;
    left: ${(props) => (props.åpenHøyreMeny ? 'calc(50% - 18rem)' : 'calc(50% - 9rem)')};
    width: max-content;
    z-index: 99;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`;

const NavnTekst = styled(BodyShort)`
    white-space: nowrap;
    margin-right: 0.5rem;
`;

const Hjelpetekst = styled(HelpText)``;

const LukkKnapp = styled(Button)`
    display: flex;
    justify-content: center;
    align-items: center;
    grid-column: 3;
    grid-row: 1;
`;

const InnholdGrid = styled.div`
    display: grid;
    grid-template-columns: 3rem auto 3rem;
    grid-template-rows: 3rem 2rem 2rem 3rem;
`;

const SaksbehandlerNavn = styled.div`
    display: flex;
    align-items: center;
    grid-column: 2;
    grid-row: 3;
`;

const FetTekst = styled(Label)`
    grid-column: 2;
    grid-row: 2;
`;

export const OppgaveTilordnetAnnenSaksbehandlerAdvarsel: React.FC<{
    behandling: Behandling;
    åpenHøyreMeny?: boolean;
    tilordnetRessurs: string | null;
    innloggetaksbehandler: ISaksbehandler;
}> = ({ behandling, åpenHøyreMeny, tilordnetRessurs, innloggetaksbehandler }) => {
    const [advarselAlleredeLukket, settAdvarselAlleredeLukket] = useState<boolean>(false);

    const skalViseAdvarsel = () => {
        const behandlingErRedigerbar = erBehandlingRedigerbar(behandling);
        const innloggetSaksbehandlerErIkkeTilordnetDenneOppgaven =
            tilordnetRessurs !== null && tilordnetRessurs !== innloggetaksbehandler.navIdent;

        return (
            behandlingErRedigerbar &&
            innloggetSaksbehandlerErIkkeTilordnetDenneOppgaven &&
            !advarselAlleredeLukket
        );
    };

    if (!skalViseAdvarsel()) {
        return <></>;
    }

    return (
        <AdvarselEtikett åpenHøyreMeny={åpenHøyreMeny}>
            <InnholdGrid>
                <LukkKnapp
                    variant={'tertiary'}
                    size={'small'}
                    onClick={() => settAdvarselAlleredeLukket(true)}
                >
                    <Close width={32} height={32} />
                </LukkKnapp>
                <FetTekst>Advarsel</FetTekst>
                <SaksbehandlerNavn>
                    <NavnTekst>
                        Oppgaven er tilordnet saksbehandler med ident: {tilordnetRessurs}
                    </NavnTekst>
                    <Hjelpetekst placement={'bottom'}>
                        <BodyShort>
                            Saksbehandler med ident {tilordnetRessurs} har plukket denne oppgaven
                            fra oppgavebenken før deg.
                        </BodyShort>
                        <BodyShort>
                            Dersom du foretar endringer i behandlingen, så kan det hende at dere
                            skriver
                        </BodyShort>
                        <BodyShort>over hverandres vurderinger.</BodyShort>
                    </Hjelpetekst>
                </SaksbehandlerNavn>
            </InnholdGrid>
        </AdvarselEtikett>
    );
};
