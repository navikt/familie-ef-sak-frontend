import * as React from 'react';
import { Alert, BodyShort, Checkbox, Label } from '@navikt/ds-react';
import styled from 'styled-components';
import {
    fremleggOppgaveTilTekst,
    OppgaveForOpprettelseType,
    IOppgaveForOpprettelse,
} from './SendTilBeslutterFooter';

const Alertstripe = styled(Alert)`
    white-space: nowrap;
`;

const UnorderedList = styled.ul`
    list-style-type: none;
`;

const Fremleggsoppgave: React.FC<{
    behandlingErRedigerbar: boolean | undefined;
    håndterCheckboxEndring: (oppgaveType: OppgaveForOpprettelseType) => void;
    oppgaveForOpprettelse: IOppgaveForOpprettelse;
}> = ({ behandlingErRedigerbar, oppgaveForOpprettelse, håndterCheckboxEndring }) => {
    const { oppgavetyperSomKanOpprettes, oppgavetyperSomSkalOpprettes } = oppgaveForOpprettelse;

    if (oppgavetyperSomKanOpprettes.length <= 0) {
        return <></>;
    }

    if (behandlingErRedigerbar) {
        return (
            <Alertstripe variant={'info'}>
                <Label>
                    Følgende oppgaver skal opprettes automatisk ved godkjenning av dette vedtaket:
                </Label>
                {oppgavetyperSomKanOpprettes.map((oppgaveType) => (
                    <Checkbox
                        checked={oppgavetyperSomSkalOpprettes.includes(oppgaveType)}
                        key={oppgaveType}
                        onChange={() => håndterCheckboxEndring(oppgaveType)}
                    >
                        {fremleggOppgaveTilTekst[oppgaveType]}
                    </Checkbox>
                ))}
            </Alertstripe>
        );
    }

    return (
        <Alertstripe variant={'info'}>
            <Label>
                Følgende oppgaver skal opprettes automatisk ved godkjenning av dette vedtaket:
            </Label>
            <UnorderedList>
                {oppgavetyperSomSkalOpprettes.length > 0 ? (
                    oppgavetyperSomSkalOpprettes.map((oppgaveType) => (
                        <li key={oppgaveType}>
                            <Checkbox
                                onChange={() => håndterCheckboxEndring(oppgaveType)}
                                checked={oppgavetyperSomSkalOpprettes.includes(oppgaveType)}
                                disabled={true}
                            >
                                {fremleggOppgaveTilTekst[oppgaveType]}
                            </Checkbox>
                        </li>
                    ))
                ) : (
                    <li>
                        <BodyShort>Ingen oppgave opprettes automatisk</BodyShort>
                    </li>
                )}
            </UnorderedList>
        </Alertstripe>
    );
};

export default Fremleggsoppgave;
