import { describe, expect, test } from 'vitest';
import { kortNedBeskrivelse } from './kortNedBeskrivelse';

describe('kortNedBeskrivelse', () => {
    test('skal returne tom string når beskrivelse mangler', () => {
        expect(kortNedBeskrivelse(undefined)).toBe('');
        expect(kortNedBeskrivelse('')).toBe('');
    });

    test('skal fjerne første setning som starten og slutt med ---', () => {
        expect(kortNedBeskrivelse('---Beskrivelse---Det som er etter')).toBe('Det som er etter');
    });

    test('skal returnere en kortere beskrivelse og fjerne alt som er havner etter andre --- hvis det er innenfor 75 tegn', () => {
        const beskrivelse = `--- 18.10.2024 08:47 F_Z994152 E_Z994152 (Z994152) --- Oppgave er flyttet fra Z994119 til Z994152 --- 
        27.09.2024 13:52 F_Z994119 E_Z994119 (Z994119) --- Oppgave er flyttet fra <ingen> til Z994119 
        Automatisk journalført ----- `;

        expect(kortNedBeskrivelse(beskrivelse)).toBe('Oppgave er flyttet fra Z994119 til Z994152');
    });

    test('skal returnere en kortere beskrivelse som ender med ...', () => {
        const beskrivelse = `--- 18.10.2024 08:47 F_Z994152 E_Z994152 (Z994152) --- Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley`;
        const kortetNedBeskrivelse = kortNedBeskrivelse(beskrivelse);

        expect(kortetNedBeskrivelse.slice(-3)).toBe('...');
    });
});
