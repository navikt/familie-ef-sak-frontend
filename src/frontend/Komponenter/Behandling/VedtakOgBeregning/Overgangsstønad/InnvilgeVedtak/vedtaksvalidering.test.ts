import { describe, expect, test } from 'vitest';
import { InnvilgeVedtakForm } from './InnvilgeOvergangsstønad';
import {
    EAktivitet,
    EPeriodetype,
    IInntektsperiode,
    IVedtaksperiode,
} from '../../../../../App/typer/vedtak';
import { validerInnvilgetVedtakForm } from './vedtaksvalidering';
import { Sanksjonsårsak } from '../../../../../App/typer/Sanksjonsårsak';

describe('validering av innvilget overgangsstønad', () => {
    test('skal feile validering for periodebegrunnelse', () => {
        const vedtaksform = lagInnvilgeVedtakForm([], []);
        const vedtaksform2 = lagInnvilgeVedtakForm([], [], '');

        const vedtaksvalidering = validerInnvilgetVedtakForm(vedtaksform);
        const vedtaksvalidering2 = validerInnvilgetVedtakForm(vedtaksform2);

        expect(vedtaksvalidering.periodeBegrunnelse).toBe(
            'Mangelfull utfylling av periodebegrunnelse'
        );
        expect(vedtaksvalidering2.periodeBegrunnelse).toBe(
            'Mangelfull utfylling av periodebegrunnelse'
        );
    });

    test('skal feile validering for inntektsbegrunnelse', () => {
        const vedtaksform = lagInnvilgeVedtakForm([], [], 'begrunnelse');
        const vedtaksform2 = lagInnvilgeVedtakForm([], [], 'begrunnelse', '');

        const vedtaksvalidering = validerInnvilgetVedtakForm(vedtaksform);
        const vedtaksvalidering2 = validerInnvilgetVedtakForm(vedtaksform2);

        expect(vedtaksvalidering.inntektBegrunnelse).toBe(
            'Mangelfull utfylling av inntektsbegrunnelse'
        );
        expect(vedtaksvalidering2.inntektBegrunnelse).toBe(
            'Mangelfull utfylling av inntektsbegrunnelse'
        );
    });

    test('skal feile validering for samordningsfradrag', () => {
        const inntektsperioder = [lagInntektsperiode('', '', '', '', '100')];
        const vedtaksform = lagInnvilgeVedtakForm([], inntektsperioder);

        const vedtaksvalidering = validerInnvilgetVedtakForm(vedtaksform);

        expect(vedtaksvalidering.samordningsfradragType).toBe(
            'Mangelfull utfylling av type samordningsfradag'
        );
    });
});

describe('skal feile validering av vedtaksperioder', () => {
    test('Barn er over 8 år.', () => {
        const vedtaksperioder = [
            lagVedtaksperiode(
                EPeriodetype.HOVEDPERIODE,
                EAktivitet.FORSØRGER_I_ARBEID,
                '',
                '2024-11'
            ),
            lagVedtaksperiode(
                EPeriodetype.UTVIDELSE,
                EAktivitet.UTVIDELSE_FORSØRGER_I_UTDANNING,
                '',
                '2024-11'
            ),
        ];

        const vedtaksform = lagInnvilgeVedtakForm(vedtaksperioder, [], '', '', '', '2015-03-03');

        const vedtaksvalidering = validerInnvilgetVedtakForm(vedtaksform);

        expect(vedtaksvalidering.perioder).toHaveLength(2);
        expect(vedtaksvalidering.perioder[0].periodeType).toBe(
            'Barnet har fylt 8 år før til og med måned'
        );
        expect(vedtaksvalidering.perioder[1].periodeType).toBe(
            'Barnet har fylt 8 år før til og med måned'
        );
    });

    test('Manglende periodetype.', () => {
        const vedtaksperioder = [lagVedtaksperiode(), lagVedtaksperiode('')];
        const vedtaksform = lagInnvilgeVedtakForm(vedtaksperioder, []);

        const vedtaksvalidering = validerInnvilgetVedtakForm(vedtaksform);

        expect(vedtaksvalidering.perioder).toHaveLength(2);
        expect(vedtaksvalidering.perioder[0].periodeType).toBe('Mangler periodetype');
        expect(vedtaksvalidering.perioder[1].periodeType).toBe('Mangler periodetype');
    });

    test('Siste periode er opphør.', () => {
        const vedtaksperioder = [
            lagVedtaksperiode(EPeriodetype.MIDLERTIDIG_OPPHØR),
            lagVedtaksperiode(EPeriodetype.MIDLERTIDIG_OPPHØR),
        ];
        const vedtaksform = lagInnvilgeVedtakForm(vedtaksperioder, []);

        const vedtaksvalidering = validerInnvilgetVedtakForm(vedtaksform);

        expect(vedtaksvalidering.perioder).toHaveLength(2);
        expect(vedtaksvalidering.perioder[0].periodeType).toBeUndefined;
        expect(vedtaksvalidering.perioder[1].periodeType).toBe(
            'Siste periode kan ikke være opphør/ingen stønad'
        );
    });

    test('Manglende aktivitet.', () => {
        const vedtaksperioder = [
            lagVedtaksperiode(EPeriodetype.HOVEDPERIODE),
            lagVedtaksperiode(EPeriodetype.HOVEDPERIODE, ''),
        ];
        const vedtaksform = lagInnvilgeVedtakForm(vedtaksperioder, []);

        const vedtaksvalidering = validerInnvilgetVedtakForm(vedtaksform);

        expect(vedtaksvalidering.perioder).toHaveLength(2);
        expect(vedtaksvalidering.perioder[0].aktivitet).toBe('Mangler aktivitetstype');
        expect(vedtaksvalidering.perioder[1].aktivitet).toBe('Mangler aktivitetstype');
    });

    test('Periode før fødsel krever ikke aktivitetsplikt.', () => {
        const vedtaksperioder = [
            lagVedtaksperiode(EPeriodetype.PERIODE_FØR_FØDSEL, EAktivitet.IKKE_AKTIVITETSPLIKT),
            lagVedtaksperiode(EPeriodetype.PERIODE_FØR_FØDSEL, EAktivitet.FORSØRGER_I_UTDANNING),
        ];
        const vedtaksform = lagInnvilgeVedtakForm(vedtaksperioder, []);

        const vedtaksvalidering = validerInnvilgetVedtakForm(vedtaksform);

        expect(vedtaksvalidering.perioder).toHaveLength(2);
        expect(vedtaksvalidering.perioder[0].aktivitet).toBeUndefined;
        expect(vedtaksvalidering.perioder[1].aktivitet).toBe('Mangler aktivitetstype');
    });

    test('Mangelfulle fra- og tildatoer', () => {
        const vedtaksperioder = [
            lagVedtaksperiode(EPeriodetype.HOVEDPERIODE, EAktivitet.FORSØRGER_I_ARBEID),
            lagVedtaksperiode(EPeriodetype.HOVEDPERIODE, EAktivitet.FORSØRGER_I_ARBEID, ''),
            lagVedtaksperiode(EPeriodetype.HOVEDPERIODE, EAktivitet.FORSØRGER_I_ARBEID, '2024-01'),
            lagVedtaksperiode(
                EPeriodetype.HOVEDPERIODE,
                EAktivitet.FORSØRGER_I_ARBEID,
                '2024-01',
                ''
            ),
        ];
        const vedtaksform = lagInnvilgeVedtakForm(vedtaksperioder, []);

        const vedtaksvalidering = validerInnvilgetVedtakForm(vedtaksform);

        expect(vedtaksvalidering.perioder).toHaveLength(4);
        expect(vedtaksvalidering.perioder[0].årMånedFra).toBe(
            'Mangelfull utfylling av vedtaksperiode'
        );
        expect(vedtaksvalidering.perioder[1].årMånedFra).toBe(
            'Mangelfull utfylling av vedtaksperiode'
        );
        expect(vedtaksvalidering.perioder[2].årMånedFra).toBe(
            'Mangelfull utfylling av vedtaksperiode'
        );
        expect(vedtaksvalidering.perioder[3].årMånedFra).toBe(
            'Mangelfull utfylling av vedtaksperiode'
        );
    });

    test('Fradato må komme før tildato.', () => {
        const vedtaksperioder = [
            lagVedtaksperiode(
                EPeriodetype.HOVEDPERIODE,
                EAktivitet.FORSØRGER_I_ARBEID,
                '2024-05',
                '2024-01'
            ),
        ];
        const vedtaksform = lagInnvilgeVedtakForm(vedtaksperioder, []);

        const vedtaksvalidering = validerInnvilgetVedtakForm(vedtaksform);

        expect(vedtaksvalidering.perioder).toHaveLength(1);
        expect(vedtaksvalidering.perioder[0].årMånedFra).toBe(
            'Ugyldig periode - fra (2024-05) må være før til (2024-01)'
        );
    });

    test('Fradato på etterfølgende periode må være etter tildato på forrige periode.', () => {
        const vedtaksperioder = [
            lagVedtaksperiode(
                EPeriodetype.HOVEDPERIODE,
                EAktivitet.FORSØRGER_I_ARBEID,
                '2024-01',
                '2024-05'
            ),
            lagVedtaksperiode(
                EPeriodetype.HOVEDPERIODE,
                EAktivitet.FORSØRGER_I_ARBEID,
                '2024-02',
                '2024-06'
            ),
        ];
        const vedtaksform = lagInnvilgeVedtakForm(vedtaksperioder, []);

        const vedtaksvalidering = validerInnvilgetVedtakForm(vedtaksform);

        expect(vedtaksvalidering.perioder).toHaveLength(2);
        expect(vedtaksvalidering.perioder[0].årMånedFra).toBeUndefined;
        expect(vedtaksvalidering.perioder[1].årMånedFra).toBe(
            'Ugyldig etterfølgende periode - fra (2024-02) må være etter til (2024-05)'
        );
    });

    test('Etterfølgende perioder henger ikke sammen.', () => {
        const vedtaksperioder = [
            lagVedtaksperiode(
                EPeriodetype.HOVEDPERIODE,
                EAktivitet.FORSØRGER_I_ARBEID,
                '2024-01',
                '2024-02'
            ),
            lagVedtaksperiode(
                EPeriodetype.HOVEDPERIODE,
                EAktivitet.FORSØRGER_I_ARBEID,
                '2024-04',
                '2024-05'
            ),
        ];
        const vedtaksform = lagInnvilgeVedtakForm(vedtaksperioder, []);

        const vedtaksvalidering = validerInnvilgetVedtakForm(vedtaksform);

        expect(vedtaksvalidering.perioder).toHaveLength(2);
        expect(vedtaksvalidering.perioder[0].årMånedFra).toBeUndefined;
        expect(vedtaksvalidering.perioder[1].årMånedFra).toBe('Periodene er ikke sammenhengende');
    });

    test('Første fradato kan ikke være mer enn 7mnd frem i tid.', () => {
        const vedtaksperioder = [
            lagVedtaksperiode(
                EPeriodetype.HOVEDPERIODE,
                EAktivitet.FORSØRGER_I_ARBEID,
                '2024-11',
                '2024-11'
            ),
        ];
        const vedtaksform = lagInnvilgeVedtakForm(vedtaksperioder, []);

        const vedtaksvalidering = validerInnvilgetVedtakForm(vedtaksform);

        expect(vedtaksvalidering.perioder).toHaveLength(1);
        expect(vedtaksvalidering.perioder[0].årMånedFra).toBe(
            'Startdato (2024-11) mer enn 7mnd frem i tid'
        );
    });

    test('Etterfølgende fradato kan ikke være mer enn 18mnd frem i tid.', () => {
        const vedtaksperioder = [
            lagVedtaksperiode(
                EPeriodetype.HOVEDPERIODE,
                EAktivitet.FORSØRGER_I_ARBEID,
                '2024-05',
                '2024-06'
            ),
            lagVedtaksperiode(
                EPeriodetype.MIDLERTIDIG_OPPHØR,
                EAktivitet.FORSØRGER_I_ARBEID,
                '2024-07',
                '2026-06'
            ),
            lagVedtaksperiode(
                EPeriodetype.HOVEDPERIODE,
                EAktivitet.FORSØRGER_I_ARBEID,
                '2026-07',
                '2026-08'
            ),
        ];
        const vedtaksform = lagInnvilgeVedtakForm(vedtaksperioder, []);

        const vedtaksvalidering = validerInnvilgetVedtakForm(vedtaksform);

        expect(vedtaksvalidering.perioder).toHaveLength(3);
        expect(vedtaksvalidering.perioder[0].årMånedFra).toBeUndefined;
        expect(vedtaksvalidering.perioder[1].årMånedFra).toBeUndefined;
        expect(vedtaksvalidering.perioder[2].årMånedFra).toBe(
            'Startdato (2026-07) mer enn 18mnd frem i tid'
        );
    });
});

describe('skal feile validering av inntektsperioder', () => {
    test('ugyldige tallverdier', () => {
        const inntektsperioder = [
            lagInntektsperiode('2024-01', '10.1', '10.1', '10.1', '10.1'),
            lagInntektsperiode('2024-02', 10.1, 10.1, 10.1, 10.1),
        ];

        const vedtaksform = lagInnvilgeVedtakForm([], inntektsperioder, '', '', '', '2015-03-03');

        const vedtaksvalidering = validerInnvilgetVedtakForm(vedtaksform);

        expect(vedtaksvalidering.inntekter).toHaveLength(2);
        expect(vedtaksvalidering.inntekter[0].dagsats).toBe('Ugyldig verdi - kun heltall tillatt');
        expect(vedtaksvalidering.inntekter[0].forventetInntekt).toBe(
            'Ugyldig verdi - kun heltall tillatt'
        );
        expect(vedtaksvalidering.inntekter[0].månedsinntekt).toBe(
            'Ugyldig verdi - kun heltall tillatt'
        );
        expect(vedtaksvalidering.inntekter[0].samordningsfradrag).toBe(
            'Ugyldig verdi - kun heltall tillatt'
        );
        expect(vedtaksvalidering.inntekter[1].dagsats).toBe('Ugyldig verdi - kun heltall tillatt');
        expect(vedtaksvalidering.inntekter[1].forventetInntekt).toBe(
            'Ugyldig verdi - kun heltall tillatt'
        );
        expect(vedtaksvalidering.inntekter[1].månedsinntekt).toBe(
            'Ugyldig verdi - kun heltall tillatt'
        );
        expect(vedtaksvalidering.inntekter[1].samordningsfradrag).toBe(
            'Ugyldig verdi - kun heltall tillatt'
        );
    });

    test('mangelfull inntektsperiode', () => {
        const inntektsperioder = [lagInntektsperiode(), lagInntektsperiode('')];

        const vedtaksform = lagInnvilgeVedtakForm([], inntektsperioder);

        const vedtaksvalidering = validerInnvilgetVedtakForm(vedtaksform);

        expect(vedtaksvalidering.inntekter).toHaveLength(2);
        expect(vedtaksvalidering.inntekter[0].årMånedFra).toBe(
            'Mangelfull utfylling av inntektsperiode'
        );
        expect(vedtaksvalidering.inntekter[1].årMånedFra).toBe(
            'Mangelfull utfylling av inntektsperiode'
        );
    });

    test('Første inntektsperiode må starte samtidig som første vedtaksperiode.', () => {
        const vedtaksperioder = [
            lagVedtaksperiode(EPeriodetype.HOVEDPERIODE, EAktivitet.FORSØRGER_I_ARBEID, '2024-01'),
            lagVedtaksperiode(EPeriodetype.HOVEDPERIODE, EAktivitet.FORSØRGER_I_ARBEID, '2024-02'),
        ];
        const inntektsperioder = [lagInntektsperiode('2024-02'), lagInntektsperiode('2024-03')];

        const vedtaksform = lagInnvilgeVedtakForm(vedtaksperioder, inntektsperioder);

        const vedtaksvalidering = validerInnvilgetVedtakForm(vedtaksform);

        expect(vedtaksvalidering.inntekter).toHaveLength(2);
        expect(vedtaksvalidering.inntekter[0].årMånedFra).toBe(
            'Første inntektsperiode må være lik vedtaksperiode'
        );
        expect(vedtaksvalidering.inntekter[1].årMånedFra).toBeUndefined;
    });

    test('Fradato på etterfølgende inntektsperiode må være etter tildato på forrige periode.', () => {
        const inntektsperioder = [lagInntektsperiode('2024-01'), lagInntektsperiode('2023-12')];
        const vedtaksform = lagInnvilgeVedtakForm([], inntektsperioder);

        const vedtaksvalidering = validerInnvilgetVedtakForm(vedtaksform);

        expect(vedtaksvalidering.inntekter).toHaveLength(2);
        expect(vedtaksvalidering.inntekter[0].årMånedFra).toBeUndefined;
        expect(vedtaksvalidering.inntekter[1].årMånedFra).toBe(
            'Ugyldig etterfølgende periode - fra (2023-12) må være etter til (2024-01)'
        );
    });

    test('Inntektsperiode kan ikke starte mer enn 18 måneder frem i tid.', () => {
        const inntektsperioder = [lagInntektsperiode('2024-02'), lagInntektsperiode('2025-10')];
        const vedtaksform = lagInnvilgeVedtakForm([], inntektsperioder);

        const vedtaksvalidering = validerInnvilgetVedtakForm(vedtaksform);

        expect(vedtaksvalidering.inntekter).toHaveLength(2);
        expect(vedtaksvalidering.inntekter[0].årMånedFra).toBeUndefined;
        expect(vedtaksvalidering.inntekter[1].årMånedFra).toBe(
            'Startdato (2025-10) mer enn 18mnd frem i tid'
        );
    });

    test('Siste inntektsperiode kan ikke starte etter sluttdato på den siste vedtaksperioden.', () => {
        const vedtaksperioder = [lagVedtaksperiode('', '', '2024-02', '2024-08')];
        const inntektsperioder = [lagInntektsperiode('2024-01'), lagInntektsperiode('2024-09')];
        const vedtaksform = lagInnvilgeVedtakForm(vedtaksperioder, inntektsperioder);

        const vedtaksvalidering = validerInnvilgetVedtakForm(vedtaksform);

        expect(vedtaksvalidering.inntekter).toHaveLength(2);
        expect(vedtaksvalidering.inntekter[0].årMånedFra).toBeUndefined;
        expect(vedtaksvalidering.inntekter[1].årMånedFra).toBe(
            'Startdato (2024-09) er etter vedtaksperioden'
        );
    });
});

const lagVedtaksperiode = (
    periodeType?: EPeriodetype | '' | undefined,
    aktivitet?: EAktivitet | '' | undefined,
    årMånedFra?: string,
    årMånedTil?: string,
    sanksjonsårsak?: Sanksjonsårsak
): IVedtaksperiode => {
    return {
        periodeType: periodeType,
        aktivitet: aktivitet,
        årMånedFra: årMånedFra,
        årMånedTil: årMånedTil,
        sanksjonsårsak: sanksjonsårsak,
    };
};

const lagInntektsperiode = (
    årMånedFra?: string,
    dagsats?: number | string,
    månedsinntekt?: number | string,
    forventetInntekt?: number | string,
    samordningsfradrag?: number | string,
    harSaksbehandlerManueltTastetHundreBeløp?: boolean
): IInntektsperiode => {
    return {
        årMånedFra: årMånedFra,
        dagsats: dagsats,
        månedsinntekt: månedsinntekt,
        forventetInntekt: forventetInntekt,
        samordningsfradrag: samordningsfradrag,
        harSaksbehandlerManueltTastetHundreBeløp: harSaksbehandlerManueltTastetHundreBeløp,
    };
};

const lagInnvilgeVedtakForm = (
    vedtaksperioder: IVedtaksperiode[],
    inntektsperiode: IInntektsperiode[],
    periodeBegrunnelse?: string,
    inntektBegrunnelse?: string,
    samordningsfradragType?: string,
    yngsteBarnFødselsdato?: string
): InnvilgeVedtakForm => {
    return {
        perioder: vedtaksperioder,
        inntekter: inntektsperiode,
        periodeBegrunnelse: periodeBegrunnelse,
        inntektBegrunnelse: inntektBegrunnelse,
        samordningsfradragType: samordningsfradragType,
        yngsteBarnFødselsdato: yngsteBarnFødselsdato,
    };
};
