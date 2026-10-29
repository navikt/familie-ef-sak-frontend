import { describe, expect, test } from 'vitest';
import { erGyldigPersonident, erNPID } from './personident';

describe('erNPID', () => {
    test('godtar NPID med måned +20', () => {
        expect(erNPID('01217012345')).toBe(true);
        expect(erNPID('01327012345')).toBe(true);
    });

    test('godtar syntetisk NPID med måned +60', () => {
        expect(erNPID('01617012345')).toBe(true);
        expect(erNPID('01727012345')).toBe(true);
    });

    test('avviser identer som ikke er NPID', () => {
        expect(erNPID('01017012345')).toBe(false);
        expect(erNPID('01207012345')).toBe(false);
        expect(erNPID('01337012345')).toBe(false);
        expect(erNPID('01417012345')).toBe(false);
        expect(erNPID('0121701234')).toBe(false);
        expect(erNPID('ab21cdefghi')).toBe(false);
    });
});

describe('erGyldigPersonident', () => {
    test('godtar gyldig dnr', () => {
        expect(erGyldigPersonident('41017012345')).toBe(true);
    });

    test('godtar NPID selv om fnrvalidator avviser den', () => {
        expect(erGyldigPersonident('01217012345')).toBe(true);
        expect(erGyldigPersonident('01617012345')).toBe(true);
    });

    test('avviser ugyldige identer', () => {
        expect(erGyldigPersonident('01017012345')).toBe(false);
        expect(erGyldigPersonident('123')).toBe(false);
        expect(erGyldigPersonident('')).toBe(false);
    });
});
