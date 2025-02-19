import { RadioGroup, Radio, CheckboxGroup, Checkbox } from '@navikt/ds-react';
import React, { FC } from 'react';
import {
    fremleggsoppgaveSomSkalOpprettesTilTekst,
    OppgaveTypeForOpprettelse,
} from './oppgaveForOpprettelseTyper';
import { styled } from 'styled-components';
import Årvelger from '../../../Felles/Input/MånedÅr/ÅrVelger';

const StyledÅrvelger = styled(Årvelger)`
    max-width: fit-content;
`;

const MAKS_ANTALL_ÅR_TILBAKE = 0;
const MAKS_ANTALL_ÅR_FREM = 2;

const LEGEND_TEKST = 'Følgende oppgave skal opprettes automatisk når vedtaket er godkjent:';

export const FremleggsoppgaverForOpprettelse: FC<{
    årForInntektskontrollSelvstendigNæringsdrivende: number | undefined;
    oppgavetyperSomKanOpprettes: OppgaveTypeForOpprettelse[] | undefined;
    oppgavetyperSomSkalOpprettes: OppgaveTypeForOpprettelse[];
    settOppgavetyperSomSkalOpprettes: React.Dispatch<
        React.SetStateAction<OppgaveTypeForOpprettelse[]>
    >;
    settÅrForInntektskontrollSelvstendigNæringsdrivende: React.Dispatch<
        React.SetStateAction<number | undefined>
    >;
}> = ({
    årForInntektskontrollSelvstendigNæringsdrivende,
    oppgavetyperSomKanOpprettes,
    oppgavetyperSomSkalOpprettes,
    settOppgavetyperSomSkalOpprettes,
    settÅrForInntektskontrollSelvstendigNæringsdrivende,
}) => {
    const handleSettÅr = (år: number) => settÅrForInntektskontrollSelvstendigNæringsdrivende(år);

    const kanVelgeMellomFlereOppgavetyper =
        oppgavetyperSomKanOpprettes && oppgavetyperSomKanOpprettes.length > 1;

    if (!oppgavetyperSomKanOpprettes) {
        return;
    }

    return (
        <>
            {kanVelgeMellomFlereOppgavetyper ? (
                <RadioGroup
                    legend={LEGEND_TEKST}
                    onChange={(value) => {
                        settOppgavetyperSomSkalOpprettes([value as OppgaveTypeForOpprettelse]);
                        settÅrForInntektskontrollSelvstendigNæringsdrivende(undefined);
                    }}
                    value={oppgavetyperSomSkalOpprettes[0]}
                >
                    {oppgavetyperSomKanOpprettes.map((oppgavetype) => (
                        <Radio key={oppgavetype} value={oppgavetype}>
                            {fremleggsoppgaveSomSkalOpprettesTilTekst[oppgavetype](
                                årForInntektskontrollSelvstendigNæringsdrivende
                            )}
                        </Radio>
                    ))}
                    <Radio key="ingen" value={''}>
                        Ingen
                    </Radio>
                </RadioGroup>
            ) : (
                <CheckboxGroup
                    legend={LEGEND_TEKST}
                    onChange={(value) => {
                        settOppgavetyperSomSkalOpprettes(value);
                        settÅrForInntektskontrollSelvstendigNæringsdrivende(undefined);
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
        </>
    );
};
