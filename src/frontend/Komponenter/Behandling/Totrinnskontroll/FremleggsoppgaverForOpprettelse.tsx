import { RadioGroup, Radio, CheckboxGroup, Checkbox } from '@navikt/ds-react';
import React, { FC } from 'react';
import {
    fremleggsoppgaveSomSkalOpprettesTilTekst,
    OppgaveTypeForOpprettelse,
} from './oppgaveForOpprettelseTyper';
import { styled } from 'styled-components';
import Årvelger from '../../../Felles/Input/MånedÅr/ÅrVelger';
import { SendTilBeslutterRequest } from './SendTilBeslutterFooter';

const StyledÅrvelger = styled(Årvelger)`
    max-width: fit-content;
`;

const MAKS_ANTALL_ÅR_TILBAKE = 0;
const MAKS_ANTALL_ÅR_FREM = 5; //TODO: Hvor mange år er hensiktsmessig?

// TODO: Navn?
export const FremleggsoppgaverForOpprettelse: FC<{
    årForInntektskontrollSelvstendigNæringsdrivende: number | undefined;
    oppgavetyperSomKanOpprettes: OppgaveTypeForOpprettelse[] | undefined;
    oppgavetyperSomSkalOpprettes: OppgaveTypeForOpprettelse[];
    sendTilBeslutterRequest: SendTilBeslutterRequest;
    settSendTilBeslutterRequest: React.Dispatch<React.SetStateAction<SendTilBeslutterRequest>>;
}> = ({
    årForInntektskontrollSelvstendigNæringsdrivende,
    oppgavetyperSomKanOpprettes,
    oppgavetyperSomSkalOpprettes,
    sendTilBeslutterRequest,
    settSendTilBeslutterRequest,
}) => {
    const handleSettÅr = (år: number) => {
        settSendTilBeslutterRequest({
            ...sendTilBeslutterRequest,
            årForInntektskontrollSelvstendigNæringsdrivende: år,
        });
    };

    const kanVelgeMellomFlereOppgavetyper =
        oppgavetyperSomKanOpprettes && oppgavetyperSomKanOpprettes.length > 1;

    if (!oppgavetyperSomKanOpprettes) {
        return;
    }

    return (
        <>
            {kanVelgeMellomFlereOppgavetyper ? (
                <RadioGroup
                    legend="Følgende oppgaver skal opprettes automatisk ved godkjenning av dette vedtaket:"
                    onChange={(value) =>
                        settSendTilBeslutterRequest({
                            oppgavetyperSomSkalOpprettes: [value as OppgaveTypeForOpprettelse],
                            årForInntektskontrollSelvstendigNæringsdrivende: undefined,
                        })
                    }
                    value={oppgavetyperSomSkalOpprettes[0]}
                >
                    {oppgavetyperSomKanOpprettes.map((oppgavetype) => (
                        <Radio key={oppgavetype} value={oppgavetype}>
                            {fremleggsoppgaveSomSkalOpprettesTilTekst[oppgavetype](
                                årForInntektskontrollSelvstendigNæringsdrivende
                            )}
                        </Radio>
                    ))}
                </RadioGroup>
            ) : (
                <CheckboxGroup
                    legend="Følgende oppgaver skal opprettes automatisk ved godkjenning av dette vedtaket:" //TODO: Refaktor duplikat kode
                    onChange={(value) => {
                        settSendTilBeslutterRequest({
                            ...sendTilBeslutterRequest,
                            oppgavetyperSomSkalOpprettes: value,
                            årForInntektskontrollSelvstendigNæringsdrivende: undefined,
                        });
                    }}
                    value={oppgavetyperSomSkalOpprettes}
                >
                    {oppgavetyperSomKanOpprettes.map((oppgavetype) => (
                        <Checkbox key={oppgavetype} value={oppgavetype}>
                            {fremleggsoppgaveSomSkalOpprettesTilTekst[oppgavetype](
                                årForInntektskontrollSelvstendigNæringsdrivende
                            )}
                        </Checkbox>
                    ))}
                </CheckboxGroup>
            )}

            {oppgavetyperSomSkalOpprettes[0] ===
                OppgaveTypeForOpprettelse.INNTEKTSKONTROLL_SELVSTENDIG_NÆRINGSDRIVENDE && (
                <StyledÅrvelger
                    år={årForInntektskontrollSelvstendigNæringsdrivende}
                    settÅr={handleSettÅr}
                    antallÅrTilbake={MAKS_ANTALL_ÅR_TILBAKE}
                    antallÅrFrem={MAKS_ANTALL_ÅR_FREM}
                    size={'small'}
                />
            )}
            {/* TODO: Slett */}
            {JSON.stringify(årForInntektskontrollSelvstendigNæringsdrivende)}
            {JSON.stringify(oppgavetyperSomSkalOpprettes)}
            {JSON.stringify(sendTilBeslutterRequest)}
        </>
    );
};
