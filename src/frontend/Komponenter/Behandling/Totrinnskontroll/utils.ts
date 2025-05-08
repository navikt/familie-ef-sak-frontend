import { antallMånederSidenDato } from '../../../App/utils/dato';
import { InngangsvilkårType, IVilkår, Vilkårsresultat } from '../Inngangsvilkår/vilkår';
import { AutomatiskBrevValg } from './AutomatiskBrev';

const aleneomsorgVurderingerOppfylt = (vilkår: IVilkår) => {
    return vilkår.vurderinger.filter((vurdering) => {
        return (
            vurdering.vilkårType === InngangsvilkårType.ALENEOMSORG &&
            vurdering.resultat === Vilkårsresultat.OPPFYLT &&
            vurdering.barnId !== null
        );
    });
};

const oppfyltBarnMedSamvær = (vilkår: IVilkår) => {
    const oppfyltAleneomsorgVurderinger = aleneomsorgVurderingerOppfylt(vilkår);

    return vilkår.grunnlag.barnMedSamvær.filter((barn) =>
        oppfyltAleneomsorgVurderinger.some((oppfyltBarn) => oppfyltBarn.barnId === barn.barnId)
    );
};

export const harBarnMellomSeksOgTolvMåneder = (vilkår: IVilkår) => {
    const barnMedSamvær = oppfyltBarnMedSamvær(vilkår);

    return barnMedSamvær.some((barn) => {
        const fødselsdato = barn.registergrunnlag.fødselsdato;

        if (!fødselsdato) {
            return false;
        }

        const alderMåneder = antallMånederSidenDato(fødselsdato);

        return alderMåneder >= 6 && alderMåneder <= 12;
    });
};

export const utledAutomatiskBrev = (
    lagretAutomatiskBrev: string[] | undefined,
    erInnvilgelseOvergangsstønad: boolean,
    vilkår?: IVilkår
) => {
    if (!erInnvilgelseOvergangsstønad) {
        return [];
    }

    const harBarnMellomSeksOgTolvMnder = vilkår && harBarnMellomSeksOgTolvMåneder(vilkår);

    const automatiskBrev: Set<AutomatiskBrevValg> = new Set();

    if (lagretAutomatiskBrev && lagretAutomatiskBrev.length > 0) {
        lagretAutomatiskBrev.forEach((brev) => {
            automatiskBrev.add(brev as AutomatiskBrevValg);
        });
    }

    if (harBarnMellomSeksOgTolvMnder) {
        automatiskBrev.add(AutomatiskBrevValg.VARSEL_OM_AKTIVITETSPLIKT);
    } else {
        automatiskBrev.delete(AutomatiskBrevValg.VARSEL_OM_AKTIVITETSPLIKT);
    }

    return Array.from(automatiskBrev);
};
