import * as React from 'react';
import styled from 'styled-components';
import { BodyShort, Button, HelpText, Label } from '@navikt/ds-react';
import { EtikettInfo } from 'nav-frontend-etiketter';
import { Close } from '@navikt/ds-icons';

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
    grid-template-columns: 1.5rem auto 3rem;
    grid-template-rows: 3rem 2rem 2rem 2rem;
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

export const OppgaveAlleredePlukket: React.FC<{
    visible: boolean;
    settVisible: (oppgaveAlleredePlukket: boolean) => void;
    åpenHøyreMeny?: boolean;
}> = ({ visible, settVisible, åpenHøyreMeny }) => {
    if (!visible) {
        return null;
    }

    return (
        <AdvarselEtikett åpenHøyreMeny={åpenHøyreMeny}>
            <InnholdGrid>
                <LukkKnapp
                    variant={'tertiary'}
                    size={'small'}
                    onClick={() => settVisible(!visible)}
                >
                    <Close width={32} height={32} />
                </LukkKnapp>
                <FetTekst>Allerede plukket av:</FetTekst>
                <SaksbehandlerNavn>
                    <NavnTekst>Viktor Grøndalen Solberg</NavnTekst>
                    <Hjelpetekst placement={'bottom'}>
                        <BodyShort>
                            Dersom en annen saksbehandler har plukket en oppgave fra oppgavebenken
                            før deg
                        </BodyShort>
                        <BodyShort>
                            og du i senere tid har plukket den samme oppgaven, så kan det hende at
                            dere skriver
                        </BodyShort>
                        <BodyShort>over hverandres vurderinger.</BodyShort>
                    </Hjelpetekst>
                </SaksbehandlerNavn>
            </InnholdGrid>
        </AdvarselEtikett>
    );
};
