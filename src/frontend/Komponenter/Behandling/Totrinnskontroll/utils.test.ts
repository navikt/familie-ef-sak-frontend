import { describe, it, expect } from 'vitest';
import { harBarnMellomSeksOgTolvMåneder } from './utils';
import { IVilkår, InngangsvilkårType, Vilkårsresultat } from '../Inngangsvilkår/vilkår';

describe('Har barn mellom seks og tolv måneder', () => {
    const lagVilkår = (fødselsdato: string | null) => ({
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
                    registergrunnlag: {
                        fødselsdato,
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

    it('skal returnere false når et barn er over 12 måneder', () => {
        const fødselsdato = new Date();
        fødselsdato.setMonth(fødselsdato.getMonth() - 13);
        const vilkår = lagVilkår(fødselsdato.toISOString());

        expect(harBarnMellomSeksOgTolvMåneder(vilkår as IVilkår)).toBe(false);
    });

    it('skal returnere false hvis alder mangler', () => {
        const vilkår = lagVilkår(null);

        expect(harBarnMellomSeksOgTolvMåneder(vilkår as IVilkår)).toBe(false);
    });
});
