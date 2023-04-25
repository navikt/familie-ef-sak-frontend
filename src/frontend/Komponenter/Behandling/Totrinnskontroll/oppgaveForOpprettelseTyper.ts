export enum OppgaveTypeForOpprettelse {
    INNTEKTSKONTROLL_1_ÅR_FREM_I_TID = 'INNTEKTSKONTROLL_1_ÅR_FREM_I_TID',
}

export const oppgaveForOpprettelseTilTekst: Record<OppgaveTypeForOpprettelse, string> = {
    INNTEKTSKONTROLL_1_ÅR_FREM_I_TID:
        'Når vedtaket er godkjent skal det automatisk opprettes en oppgave for kontroll av inntekt 1 år frem i tid',
};
export const oppgaveSomSkalOpprettesTilTekst: Record<OppgaveTypeForOpprettelse, string> = {
    INNTEKTSKONTROLL_1_ÅR_FREM_I_TID:
        'Det vil automatisk opprettes en oppgave for kontroll av inntekt 1 år frem i tid når vedtaket godkjennes',
};
