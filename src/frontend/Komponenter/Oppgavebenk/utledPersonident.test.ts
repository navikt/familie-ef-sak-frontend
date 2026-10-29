import { describe, expect, test } from 'vitest';
import { utledPersonident } from './utils';
import { IOppgave } from './typer/oppgave';
import { IdentGruppe, IOppgaveIdent } from './typer/oppgaveIdent';

const oppgaveMedIdenter = (identer?: IOppgaveIdent[]) => ({ identer }) as IOppgave;

describe('utledPersonident', () => {
    test('bruker folkeregisterident når oppgaven har det', () => {
        const oppgave = oppgaveMedIdenter([
            { ident: '1234567890123', gruppe: IdentGruppe.AKTOERID },
            { ident: '01217012345', gruppe: IdentGruppe.NPID },
            { ident: '41017012345', gruppe: IdentGruppe.FOLKEREGISTERIDENT },
        ]);
        expect(utledPersonident(oppgave)).toBe('41017012345');
    });

    test('bruker NPID når oppgaven mangler folkeregisterident', () => {
        const oppgave = oppgaveMedIdenter([
            { ident: '1234567890123', gruppe: IdentGruppe.AKTOERID },
            { ident: '01217012345', gruppe: IdentGruppe.NPID },
        ]);
        expect(utledPersonident(oppgave)).toBe('01217012345');
    });

    test('gir ukjent ident når oppgaven mangler personident', () => {
        expect(utledPersonident(oppgaveMedIdenter(undefined))).toBe('Ukjent ident');
        expect(
            utledPersonident(
                oppgaveMedIdenter([{ ident: '1234567890123', gruppe: IdentGruppe.AKTOERID }])
            )
        ).toBe('Ukjent ident');
    });
});
