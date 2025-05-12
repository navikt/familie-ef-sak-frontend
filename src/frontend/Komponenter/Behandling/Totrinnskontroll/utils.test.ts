import { describe, it, expect } from 'vitest';
import { harBarnMellomSeksOgTolvMåneder } from './utils';
import { IVilkår, InngangsvilkårType, Vilkårsresultat } from '../Inngangsvilkår/vilkår';

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

    it('skal returnere false når et barn er 12 måneder eller mer', () => {
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
