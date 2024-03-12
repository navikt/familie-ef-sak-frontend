import { describe, expect, test } from 'vitest';
import { InnvilgeVedtakForm } from './InnvilgeBarnetilsyn';
import {
    ERadioValg,
    EUtgiftsperiodeAktivitet,
    EUtgiftsperiodetype,
    IPeriodeMedBeløp,
    IUtgiftsperiode,
} from '../../../../../App/typer/vedtak';
import { validerInnvilgetVedtakForm } from './vedtaksvalidering';

describe('validering av innvilget barnetilsyn', () => {
    test('skal validere begrunnelsesfelt for tilleggsstønad', () => {
        const underkjentForm = { ...lagForm(), harTilleggsstønad: ERadioValg.JA };
        const underkjentForm2 = {
            ...lagForm(),
            harTilleggsstønad: ERadioValg.JA,
            tilleggsstønadBegrunnelse: '',
        };
        const godkjentForm = { ...lagForm(), harTilleggsstønad: ERadioValg.NEI };
        const godkjentForm2 = {
            ...lagForm(),
            harTilleggsstønad: ERadioValg.NEI,
            tilleggsstønadBegrunnelse: '',
        };
        const godkjentForm3 = {
            ...lagForm(),
            harTilleggsstønad: ERadioValg.JA,
            tilleggsstønadBegrunnelse: 'Begrunnelse',
        };

        const underkjentValidering = validerInnvilgetVedtakForm(underkjentForm);
        const underkjentValidering2 = validerInnvilgetVedtakForm(underkjentForm2);
        const godkjentValidering = validerInnvilgetVedtakForm(godkjentForm);
        const godkjentValidering2 = validerInnvilgetVedtakForm(godkjentForm2);
        const godkjentValidering3 = validerInnvilgetVedtakForm(godkjentForm3);

        expect(underkjentValidering.tilleggsstønadBegrunnelse).toBe(
            'Mangelfull utfylling av begrunnelse'
        );
        expect(underkjentValidering2.tilleggsstønadBegrunnelse).toBe(
            'Mangelfull utfylling av begrunnelse'
        );
        expect(godkjentValidering.tilleggsstønadBegrunnelse).toBeUndefined;
        expect(godkjentValidering2.tilleggsstønadBegrunnelse).toBeUndefined;
        expect(godkjentValidering3.tilleggsstønadBegrunnelse).toBeUndefined;
    });

    test('skal validere begrunnelsesfelt', () => {
        const underkjentForm = { ...lagForm() };
        const underkjentForm2 = { ...lagForm(), begrunnelse: '' };
        const godkjentForm = { ...lagForm(), begrunnelse: 'Begrunnelse' };

        const underkjentValidering = validerInnvilgetVedtakForm(underkjentForm);
        const underkjentValidering2 = validerInnvilgetVedtakForm(underkjentForm2);
        const godkjentValidering = validerInnvilgetVedtakForm(godkjentForm);

        expect(underkjentValidering.begrunnelse).toBe('Mangelfull utfylling av begrunnelse');
        expect(underkjentValidering2.begrunnelse).toBe('Mangelfull utfylling av begrunnelse');
        expect(godkjentValidering.begrunnelse).toBeUndefined;
    });

    test('skal validere valg av kontantstøtte', () => {
        const underkjentForm = { ...lagForm(), harKontantstøtte: ERadioValg.IKKE_SATT };
        const godkjentForm = { ...lagForm(), harKontantstøtte: ERadioValg.NEI };
        const godkjentForm2 = { ...lagForm(), harKontantstøtte: ERadioValg.JA };

        const underkjentValidering = validerInnvilgetVedtakForm(underkjentForm);
        const godkjentValidering = validerInnvilgetVedtakForm(godkjentForm);
        const godkjentValidering2 = validerInnvilgetVedtakForm(godkjentForm2);

        expect(underkjentValidering.harKontantstøtte).toBe('Mangler verdi');
        expect(godkjentValidering.harKontantstøtte).toBeUndefined;
        expect(godkjentValidering2.harKontantstøtte).toBeUndefined;
    });

    test('skal validere valg av tilleggsstønad', () => {
        const underkjentForm = { ...lagForm(), harTilleggsstønad: ERadioValg.IKKE_SATT };
        const godkjentForm = { ...lagForm(), harTilleggsstønad: ERadioValg.NEI };
        const godkjentForm2 = { ...lagForm(), harTilleggsstønad: ERadioValg.JA };

        const underkjentValidering = validerInnvilgetVedtakForm(underkjentForm);
        const godkjentValidering = validerInnvilgetVedtakForm(godkjentForm);
        const godkjentValidering2 = validerInnvilgetVedtakForm(godkjentForm2);

        expect(underkjentValidering.harTilleggsstønad).toBe('Mangler verdi');
        expect(godkjentValidering.harTilleggsstønad).toBeUndefined;
        expect(godkjentValidering2.harTilleggsstønad).toBeUndefined;
    });

    test('skal validere valg av stønadsreduksjon', () => {
        const underkjentForm = { ...lagForm(), skalStønadReduseres: ERadioValg.IKKE_SATT };
        const godkjentForm = { ...lagForm(), skalStønadReduseres: ERadioValg.NEI };
        const godkjentForm2 = { ...lagForm(), skalStønadReduseres: ERadioValg.JA };
        const godkjentForm3 = {
            ...lagForm(),
            harTilleggsstønad: ERadioValg.NEI,
            skalStønadReduseres: ERadioValg.NEI,
        };

        const underkjentValidering = validerInnvilgetVedtakForm(underkjentForm);
        const godkjentValidering = validerInnvilgetVedtakForm(godkjentForm);
        const godkjentValidering2 = validerInnvilgetVedtakForm(godkjentForm2);
        const godkjentValidering3 = validerInnvilgetVedtakForm(godkjentForm3);

        expect(underkjentValidering.skalStønadReduseres).toBe('Mangler verdi');
        expect(godkjentValidering.skalStønadReduseres).toBeUndefined;
        expect(godkjentValidering2.skalStønadReduseres).toBeUndefined;
        expect(godkjentValidering3.skalStønadReduseres).toBeUndefined;
    });
});

describe('validering av utgiftsperioder for innvilget barnetilsyn', () => {
    test('skal validere valg av periodetype', () => {
        const utgiftsperioder: IUtgiftsperiode[] = [
            { ...lagUtgiftsperiode() },
            { ...lagUtgiftsperiode(), periodetype: EUtgiftsperiodetype.ORDINÆR },
            { ...lagUtgiftsperiode(), periodetype: EUtgiftsperiodetype.OPPHØR },
            { ...lagUtgiftsperiode(), periodetype: EUtgiftsperiodetype.SANKSJON_1_MND },
        ];
        const vedtaksform = lagForm(utgiftsperioder);
        const validering = validerInnvilgetVedtakForm(vedtaksform);

        expect(validering.utgiftsperioder.length).toBe(4);
        expect(validering.utgiftsperioder[0].periodetype).toBe('Mangler valg for periodetype');
        expect(validering.utgiftsperioder[1].periodetype).toBeUndefined;
        expect(validering.utgiftsperioder[2].periodetype).toBeUndefined;
        expect(validering.utgiftsperioder[3].periodetype).toBeUndefined;
    });

    test('siste periode kan ikke være et opphør', () => {
        const utgiftsperioder: IUtgiftsperiode[] = [
            { ...lagUtgiftsperiode(), periodetype: EUtgiftsperiodetype.ORDINÆR },
            { ...lagUtgiftsperiode(), periodetype: EUtgiftsperiodetype.ORDINÆR },
            { ...lagUtgiftsperiode(), periodetype: EUtgiftsperiodetype.OPPHØR },
        ];
        const vedtaksform = lagForm(utgiftsperioder);
        const validering = validerInnvilgetVedtakForm(vedtaksform);

        expect(validering.utgiftsperioder.length).toBe(3);
        expect(validering.utgiftsperioder[0].periodetype).toBeUndefined;
        expect(validering.utgiftsperioder[1].periodetype).toBeUndefined;
        expect(validering.utgiftsperioder[2].periodetype).toBe(
            'Siste periode kan ikke være opphør/ingen stønad'
        );
    });

    test('kan ikke velge aktivitet ved opphør eller sanksjon', () => {
        const utgiftsperioder: IUtgiftsperiode[] = [
            {
                ...lagUtgiftsperiode(),
                periodetype: EUtgiftsperiodetype.SANKSJON_1_MND,
                aktivitetstype: EUtgiftsperiodeAktivitet.I_ARBEID,
            },
            {
                ...lagUtgiftsperiode(),
                periodetype: EUtgiftsperiodetype.OPPHØR,
                aktivitetstype: EUtgiftsperiodeAktivitet.I_ARBEID,
            },
            {
                ...lagUtgiftsperiode(),
                periodetype: EUtgiftsperiodetype.ORDINÆR,
                aktivitetstype: EUtgiftsperiodeAktivitet.I_ARBEID,
            },
        ];
        const vedtaksform = lagForm(utgiftsperioder);
        const validering = validerInnvilgetVedtakForm(vedtaksform);

        expect(validering.utgiftsperioder.length).toBe(3);
        expect(validering.utgiftsperioder[0].aktivitetstype).toBe(
            'Skal ikke kunne velge aktivitetstype ved opphør eller sanksjon'
        );
        expect(validering.utgiftsperioder[1].aktivitetstype).toBe(
            'Skal ikke kunne velge aktivitetstype ved opphør eller sanksjon'
        );
        expect(validering.utgiftsperioder[2].aktivitetstype).toBeUndefined;
    });

    test('må velge aktivitetstype dersom periodetypen ikke er opphør eller sanksjon', () => {
        const utgiftsperioder: IUtgiftsperiode[] = [
            { ...lagUtgiftsperiode() },
            { ...lagUtgiftsperiode(), periodetype: EUtgiftsperiodetype.ORDINÆR },
            {
                ...lagUtgiftsperiode(),
                periodetype: EUtgiftsperiodetype.ORDINÆR,
                aktivitetstype: EUtgiftsperiodeAktivitet.I_ARBEID,
            },
        ];
        const vedtaksform = lagForm(utgiftsperioder);
        const validering = validerInnvilgetVedtakForm(vedtaksform);

        expect(validering.utgiftsperioder.length).toBe(3);
        expect(validering.utgiftsperioder[0].aktivitetstype).toBe(
            'Mangler valg for aktivitetstype'
        );
        expect(validering.utgiftsperioder[1].aktivitetstype).toBe(
            'Mangler valg for aktivitetstype'
        );
        expect(validering.utgiftsperioder[2].aktivitetstype).toBeUndefined;
    });

    test('må velge fra og til dato', () => {
        const utgiftsperioder: IUtgiftsperiode[] = [
            { ...lagUtgiftsperiode() },
            { ...lagUtgiftsperiode(), årMånedFra: '2024-01' },
            { ...lagUtgiftsperiode(), årMånedFra: '', årMånedTil: '2024-02' },
            { ...lagUtgiftsperiode(), årMånedFra: '2024-01', årMånedTil: '2024-02' },
        ];
        const vedtaksform = lagForm(utgiftsperioder);
        const validering = validerInnvilgetVedtakForm(vedtaksform);

        expect(validering.utgiftsperioder.length).toBe(4);
        expect(validering.utgiftsperioder[0].årMånedFra).toBe(
            'Mangelfull utfylling av utgiftsperiode'
        );
        expect(validering.utgiftsperioder[1].årMånedFra).toBe(
            'Mangelfull utfylling av utgiftsperiode'
        );
        expect(validering.utgiftsperioder[2].årMånedFra).toBe(
            'Mangelfull utfylling av utgiftsperiode'
        );
        expect(validering.utgiftsperioder[3].årMånedFra).toBeUndefined;
    });

    test('utgiftsperiode sin fradato må komme før tildato', () => {
        const utgiftsperioder: IUtgiftsperiode[] = [
            { ...lagUtgiftsperiode(), årMånedFra: '2024-05', årMånedTil: '2024-01' },
        ];
        const vedtaksform = lagForm(utgiftsperioder);
        const validering = validerInnvilgetVedtakForm(vedtaksform);

        expect(validering.utgiftsperioder.length).toBe(1);
        expect(validering.utgiftsperioder[0].årMånedFra).toBe(
            'Ugyldig periode - fra (2024-05) må være før til (2024-01)'
        );
    });

    test('utgiftsperiode sin fradato må starte etter den forrige utgiftsperioden sin tildato', () => {
        const utgiftsperioder: IUtgiftsperiode[] = [
            { ...lagUtgiftsperiode(), årMånedFra: '2024-01', årMånedTil: '2024-04' },
            { ...lagUtgiftsperiode(), årMånedFra: '2024-02', årMånedTil: '2024-07' },
        ];
        const vedtaksform = lagForm(utgiftsperioder);
        const validering = validerInnvilgetVedtakForm(vedtaksform);

        expect(validering.utgiftsperioder.length).toBe(2);
        expect(validering.utgiftsperioder[0].årMånedFra).toBeUndefined;
        expect(validering.utgiftsperioder[1].årMånedFra).toBe(
            'Periodene er ikke sammenhengende: februar 2024 må være etter april 2024'
        );
    });

    test('utgiftsperiodene må være sammenhengende', () => {
        const utgiftsperioder: IUtgiftsperiode[] = [
            { ...lagUtgiftsperiode(), årMånedFra: '2024-01', årMånedTil: '2024-03' },
            { ...lagUtgiftsperiode(), årMånedFra: '2024-05', årMånedTil: '2024-07' },
        ];
        const vedtaksform = lagForm(utgiftsperioder);
        const validering = validerInnvilgetVedtakForm(vedtaksform);

        expect(validering.utgiftsperioder.length).toBe(2);
        expect(validering.utgiftsperioder[0].årMånedFra).toBeUndefined;
        expect(validering.utgiftsperioder[1].årMånedFra).toBe('Periodene er ikke sammenhengende');
    });

    test('validering av antall barn valgt', () => {
        const utgiftsperioder: IUtgiftsperiode[] = [
            lagUtgiftsperiode('2024-01', '2024-02', [], 0, EUtgiftsperiodetype.ORDINÆR),
            lagUtgiftsperiode('2024-03', '2024-04', [], 0, EUtgiftsperiodetype.OPPHØR),
            lagUtgiftsperiode('2024-05', '2024-06', [], 0, EUtgiftsperiodetype.SANKSJON_1_MND),
            lagUtgiftsperiode('2024-07', '2024-08', ['1'], 0, EUtgiftsperiodetype.ORDINÆR),
            lagUtgiftsperiode('2024-09', '2024-10', ['1'], 0, EUtgiftsperiodetype.OPPHØR),
            lagUtgiftsperiode('2024-11', '2024-12', ['1'], 0, EUtgiftsperiodetype.SANKSJON_1_MND),
        ];
        const vedtaksform = lagForm(utgiftsperioder);
        const validering = validerInnvilgetVedtakForm(vedtaksform);

        expect(validering.utgiftsperioder.length).toBe(6);
        expect(validering.utgiftsperioder[0].barn[0]).toBe(
            'Mangelfull utfylling - minst et barn må velges'
        );
        expect(validering.utgiftsperioder[1].barn).toBeUndefined;
        expect(validering.utgiftsperioder[2].barn).toBeUndefined;
        expect(validering.utgiftsperioder[3].barn).toBeUndefined;
        expect(validering.utgiftsperioder[4].barn[0]).toBe(
            'Skal ikke kunne velge barn ved opphør eller sanksjon'
        );
        expect(validering.utgiftsperioder[5].barn[0]).toBe(
            'Skal ikke kunne velge barn ved opphør eller sanksjon'
        );
    });
});

describe('validering av kontantstøtteperioder for innvilget barnetilsyn', () => {
    test('Skal ikke valideres dersom ingen ingen kontantstøtte', () => {
        const kontantPerioder = [lagBeløpsperiode('2024-01', '2024-02')];
        const vedtaksform = {
            ...lagForm(),
            skalStønadReduseres: ERadioValg.NEI,
            kontantstøtteperioder: kontantPerioder,
        };
        const validering = validerInnvilgetVedtakForm(vedtaksform);

        expect(validering.kontantstøtteperioder).toBeDefined;
        expect(validering.kontantstøtteperioder).toHaveLength(1);
        expect(validering.kontantstøtteperioder[0].årMånedFra).toBeUndefined;
        expect(validering.kontantstøtteperioder[0].årMånedTil).toBeUndefined;
        expect(validering.kontantstøtteperioder[0].beløp).toBeUndefined;
    });

    test('Må velge fra og til dato ', () => {
        const kontantPerioder = [
            lagBeløpsperiode('', ''),
            lagBeløpsperiode('2024-01', ''),
            lagBeløpsperiode('', '2024-02'),
            lagBeløpsperiode('2024-01', '2024-02'),
        ];
        const vedtaksform = { ...lagForm(), kontantstøtteperioder: kontantPerioder };
        const validering = validerInnvilgetVedtakForm(vedtaksform);

        expect(validering.kontantstøtteperioder).toBeDefined;
        expect(validering.kontantstøtteperioder).toHaveLength(4);
        expect(validering.kontantstøtteperioder[0].årMånedFra).toBe(
            'Mangelfull utfylling av periode'
        );
        expect(validering.kontantstøtteperioder[1].årMånedFra).toBe(
            'Mangelfull utfylling av periode'
        );
        expect(validering.kontantstøtteperioder[2].årMånedFra).toBe(
            'Mangelfull utfylling av periode'
        );
        expect(validering.kontantstøtteperioder[3].årMånedFra).toBeUndefined;
    });

    test('fraDato må komme før tilDato', () => {
        const kontantPerioder = [lagBeløpsperiode('2024-03', '2024-02')];
        const vedtaksform = { ...lagForm(), kontantstøtteperioder: kontantPerioder };
        const validering = validerInnvilgetVedtakForm(vedtaksform);

        expect(validering.kontantstøtteperioder).toBeDefined;
        expect(validering.kontantstøtteperioder).toHaveLength(1);
        expect(validering.kontantstøtteperioder[0].årMånedFra).toBe(
            'Ugyldig periode - fra (2024-03) må være før til (2024-02)'
        );
    });

    test('fraDato på periode må komme etter tilDato på forrige periode', () => {
        const kontantPerioder = [
            lagBeløpsperiode('2024-01', '2024-05', 10),
            lagBeløpsperiode('2024-03', '2024-08', 10),
        ];
        const vedtaksform = { ...lagForm(), kontantstøtteperioder: kontantPerioder };
        const validering = validerInnvilgetVedtakForm(vedtaksform);

        expect(validering.kontantstøtteperioder).toBeDefined;
        expect(validering.kontantstøtteperioder).toHaveLength(2);
        expect(validering.kontantstøtteperioder[0].årMånedFra).toBeUndefined;
        expect(validering.kontantstøtteperioder[1].årMånedFra).toBe(
            'Periodene er ikke sammenhengende: mars 2024 må være etter mai 2024'
        );
    });

    describe('validering av tilleggsstøndadsperioder', () => {
        test('skal ikke valideres dersom ingen tilleggsstønad eller stønadsreduksjon', () => {
            const tilleggsstønadPerioder = [
                lagBeløpsperiode('2024-01', '2024-02', 10),
                lagBeløpsperiode('2024-03', '2024-04', 10),
            ];
            const vedtaksform = {
                ...lagForm(),
                harTilleggsstønad: ERadioValg.NEI,
                skalStønadReduseres: ERadioValg.JA,
                tilleggsstønadsperioder: tilleggsstønadPerioder,
            };
            const vedtaksform2 = {
                ...lagForm(),
                harTilleggsstønad: ERadioValg.JA,
                skalStønadReduseres: ERadioValg.NEI,
                tilleggsstønadsperioder: tilleggsstønadPerioder,
            };
            const validering = validerInnvilgetVedtakForm(vedtaksform);
            const validering2 = validerInnvilgetVedtakForm(vedtaksform2);

            expect(validering.tilleggsstønadsperioder).toBeDefined;
            expect(validering.tilleggsstønadsperioder.length).toBe(1);
            expect(validering.tilleggsstønadsperioder[0].årMånedFra).toBe(undefined);
            expect(validering.tilleggsstønadsperioder[0].årMånedTil).toBe(undefined);
            expect(validering.tilleggsstønadsperioder[0].beløp).toBe(undefined);

            expect(validering2.tilleggsstønadsperioder).toBeDefined;
            expect(validering2.tilleggsstønadsperioder.length).toBe(1);
            expect(validering2.tilleggsstønadsperioder[0].årMånedFra).toBe(undefined);
            expect(validering2.tilleggsstønadsperioder[0].årMånedTil).toBe(undefined);
            expect(validering2.tilleggsstønadsperioder[0].beløp).toBe(undefined);
        });

        test('må velge fradato og tildato', () => {
            const tilleggsstønadPerioder = [
                lagBeløpsperiode('', '', 10),
                lagBeløpsperiode('2024-03', '', 10),
                lagBeløpsperiode('', '2024-04', 10),
                lagBeløpsperiode('2024-05', '2024-06', 10),
            ];
            const vedtaksform = { ...lagForm(), tilleggsstønadsperioder: tilleggsstønadPerioder };
            const validering = validerInnvilgetVedtakForm(vedtaksform);

            expect(validering.tilleggsstønadsperioder).toBeDefined;
            expect(validering.tilleggsstønadsperioder.length).toBe(4);
            expect(validering.tilleggsstønadsperioder[0].årMånedFra).toBe(
                'Mangelfull utfylling av periode'
            );
            expect(validering.tilleggsstønadsperioder[1].årMånedFra).toBe(
                'Mangelfull utfylling av periode'
            );
            expect(validering.tilleggsstønadsperioder[2].årMånedFra).toBe(
                'Mangelfull utfylling av periode'
            );
            expect(validering.tilleggsstønadsperioder[3].årMånedFra).toBeUndefined;
        });

        test('fradato må komme før tildato', () => {
            const tilleggsstønadPerioder = [lagBeløpsperiode('2024-03', '2024-02', 10)];
            const vedtaksform = { ...lagForm(), tilleggsstønadsperioder: tilleggsstønadPerioder };
            const validering = validerInnvilgetVedtakForm(vedtaksform);

            expect(validering.tilleggsstønadsperioder).toBeDefined;
            expect(validering.tilleggsstønadsperioder.length).toBe(1);
            expect(validering.tilleggsstønadsperioder[0].årMånedFra).toBe(
                'Ugyldig periode - fra (2024-03) må være før til (2024-02)'
            );
        });

        test('fradato på periode må komme etter tildato på den forrige perioden', () => {
            const tilleggsstønadPerioder = [
                lagBeløpsperiode('2024-01', '2024-04', 10),
                lagBeløpsperiode('2024-03', '2024-08', 10),
            ];
            const vedtaksform = { ...lagForm(), tilleggsstønadsperioder: tilleggsstønadPerioder };
            const validering = validerInnvilgetVedtakForm(vedtaksform);

            expect(validering.tilleggsstønadsperioder).toBeDefined;
            expect(validering.tilleggsstønadsperioder.length).toBe(2);
            expect(validering.tilleggsstønadsperioder[0].årMånedFra).toBeUndefined;
            expect(validering.tilleggsstønadsperioder[1].årMånedFra).toBe(
                'Periodene er ikke sammenhengende: mars 2024 må være etter april 2024'
            );
        });
    });
});

const lagUtgiftsperiode = (
    årMånedFra?: string,
    årMånedTil?: string,
    barn?: string[],
    utgifter?: number,
    periodetype?: EUtgiftsperiodetype,
    aktivitetstype?: EUtgiftsperiodeAktivitet
): IUtgiftsperiode => {
    return {
        årMånedFra: årMånedFra ?? '',
        årMånedTil: årMånedTil ?? '',
        barn: barn ?? [],
        utgifter: utgifter,
        periodetype: periodetype,
        aktivitetstype: aktivitetstype,
    };
};

const lagBeløpsperiode = (
    årMånedFra: string,
    årMånedTil: string,
    beløp?: number
): IPeriodeMedBeløp => {
    return {
        årMånedFra: årMånedFra,
        årMånedTil: årMånedTil,
        beløp: beløp,
    };
};

const lagForm = (
    utgiftsperioder?: IUtgiftsperiode[],
    harKontantstøtte?: ERadioValg,
    harTilleggsstønad?: ERadioValg,
    skalStønadReduseres?: ERadioValg,
    tilleggsstønadBegrunnelse?: string,
    kontantstøtteperioder?: IPeriodeMedBeløp[],
    tilleggsstønadsperioder?: IPeriodeMedBeløp[],
    begrunnelse?: string
): InnvilgeVedtakForm => {
    return {
        utgiftsperioder: utgiftsperioder ?? [],
        kontantstøtteperioder: kontantstøtteperioder,
        harKontantstøtte: harKontantstøtte ?? ERadioValg.JA,
        harTilleggsstønad: harTilleggsstønad ?? ERadioValg.JA,
        tilleggsstønadBegrunnelse: tilleggsstønadBegrunnelse,
        skalStønadReduseres: skalStønadReduseres ?? ERadioValg.JA,
        tilleggsstønadsperioder: tilleggsstønadsperioder,
        begrunnelse: begrunnelse,
    };
};
