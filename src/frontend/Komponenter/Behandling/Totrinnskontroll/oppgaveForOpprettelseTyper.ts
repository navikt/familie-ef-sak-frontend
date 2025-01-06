export enum OppgaveTypeForOpprettelse {
    INNTEKTSKONTROLL_1_ÅR_FREM_I_TID = 'INNTEKTSKONTROLL_1_ÅR_FREM_I_TID',
    INNTEKTSKONTROLL_SELVSTENDIG_NÆRINGSDRIVENDE = 'INNTEKTSKONTROLL_SELVSTENDIG_NÆRINGSDRIVENDE',
}

export const oppgaveForOpprettelseTilTekst: Record<OppgaveTypeForOpprettelse, string> = {
    INNTEKTSKONTROLL_1_ÅR_FREM_I_TID:
        'Når vedtaket er godkjent skal det automatisk opprettes en oppgave for kontroll av inntekt 1 år frem i tid',
    INNTEKTSKONTROLL_SELVSTENDIG_NÆRINGSDRIVENDE:
        'Når vedtaket er godkjent skal det automatisk opprettes en oppgave for kontroll av inntekt for selvstendig næringsdrivende',
};
export const oppgaveSomSkalOpprettesTilTekst: Record<OppgaveTypeForOpprettelse, string> = {
    INNTEKTSKONTROLL_1_ÅR_FREM_I_TID:
        'Det vil automatisk opprettes en oppgave for kontroll av inntekt 1 år frem i tid når vedtaket godkjennes',
    INNTEKTSKONTROLL_SELVSTENDIG_NÆRINGSDRIVENDE:
        'Det vil automatisk opprettes en oppgave for kontroll av inntekt for selvstendig næringsdrivende når vedtaket godkjennes',
};
