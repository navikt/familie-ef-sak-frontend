import { describe, it, expect } from 'vitest';
import { harBarnMellomSeksOgTolvMåneder, utledAutomatiskBrev } from './utils';
import { IVilkår, InngangsvilkårType, Vilkårsresultat } from '../Inngangsvilkår/vilkår';
import { AutomatiskBrevValg } from './AutomatiskBrev';

describe('Har barn mellom seks og tolv måneder', () => {
    const toÅrGammel = new Date(new Date().setMonth(new Date().getMonth() - 24)).toISOString();

    const lagVilkår = (fødselsdato: string | null) => ({
        vurderinger: [
            {
                vilkårType: InngangsvilkårType.ALENEOMSORG,
                resultat: Vilkårsresultat.OPPFYLT,
                barnId: '1',
            },
            {
                vilkårType: InngangsvilkårType.ALENEOMSORG,
                resultat: Vilkårsresultat.OPPFYLT,
                barnId: '2 - 2 år',
            },
        ],
        grunnlag: {
            barnMedSamvær: [
                {
                    barnId: '1',
                    registergrunnlag: {
                        fødselsdato,
                    },
                },
                {
                    barnId: '2 - 2 år',
                    registergrunnlag: {
                        fødselsdato: toÅrGammel,
                    },
                },
            ],
        },
    });

    it('skal returnere true når et barn er mellom 6 og 12 måneder gammelt', () => {
        const fødselsdato = new Date();
        fødselsdato.setMonth(fødselsdato.getMonth() - 8);
        const vilkår = lagVilkår(fødselsdato.toISOString());

        expect(harBarnMellomSeksOgTolvMåneder(vilkår as IVilkår)).toBe(true);
    });

    it('skal returnere false når et barn er yngre enn 6 måneder', () => {
        const fødselsdato = new Date();
        fødselsdato.setMonth(fødselsdato.getMonth() - 4);
        const vilkår = lagVilkår(fødselsdato.toISOString());

        expect(harBarnMellomSeksOgTolvMåneder(vilkår as IVilkår)).toBe(false);
    });

    it('skal returnere false når et barn er 12 måneder eller eldre', () => {
        const fødselsdato = new Date();
        fødselsdato.setMonth(fødselsdato.getMonth() - 12);
        const vilkår = lagVilkår(fødselsdato.toISOString());

        expect(harBarnMellomSeksOgTolvMåneder(vilkår as IVilkår)).toBe(false);
    });

    it('skal returnere false hvis alder mangler', () => {
        const vilkår = lagVilkår(null);

        expect(harBarnMellomSeksOgTolvMåneder(vilkår as IVilkår)).toBe(false);
    });
});

describe('utledAutomatiskBrev', () => {
    const åtteMånederGammel = new Date();
    åtteMånederGammel.setMonth(åtteMånederGammel.getMonth() - 8);

    const lagVilkårMedBarn = (fødselsdato: string) =>
        ({
            vurderinger: [
                {
                    vilkårType: InngangsvilkårType.ALENEOMSORG,
                    resultat: Vilkårsresultat.OPPFYLT,
                    barnId: '1',
                },
            ],
            grunnlag: {
                barnMedSamvær: [
                    {
                        barnId: '1',
                        registergrunnlag: { fødselsdato },
                    },
                ],
            },
        }) as unknown as IVilkår;

    const vilkårMedBarnMellom6Og12Mnd = lagVilkårMedBarn(åtteMånederGammel.toISOString());

    it('skal auto-avhuke varsel om aktivitetsplikt når barn er mellom 6 og 12 måneder og toggle er av', () => {
        const resultat = utledAutomatiskBrev(undefined, true, vilkårMedBarnMellom6Og12Mnd, false);
        expect(resultat).toContain(AutomatiskBrevValg.VARSEL_OM_AKTIVITETSPLIKT);
    });

    it('skal ikke auto-avhuke varsel om aktivitetsplikt når overgangsregel-toggle er på', () => {
        const resultat = utledAutomatiskBrev(undefined, true, vilkårMedBarnMellom6Og12Mnd, true);
        expect(resultat).not.toContain(AutomatiskBrevValg.VARSEL_OM_AKTIVITETSPLIKT);
    });

    it('skal ikke auto-avhuke når overgangsregel-toggle er av men barn er utenfor aldersgrensen', () => {
        const toÅrGammel = new Date();
        toÅrGammel.setFullYear(toÅrGammel.getFullYear() - 2);
        const vilkår = lagVilkårMedBarn(toÅrGammel.toISOString());

        const resultat = utledAutomatiskBrev(undefined, true, vilkår, false);
        expect(resultat).not.toContain(AutomatiskBrevValg.VARSEL_OM_AKTIVITETSPLIKT);
    });

    it('skal returnere tom liste når det ikke er innvilgelse overgangsstønad', () => {
        const resultat = utledAutomatiskBrev(undefined, false, vilkårMedBarnMellom6Og12Mnd, false);
        expect(resultat).toHaveLength(0);
    });
});
