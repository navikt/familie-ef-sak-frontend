import { Stønadstype } from '../../../App/typer/behandlingstema';
import { Behandling } from '../../../App/typer/fagsak';
import { InngangsvilkårType, IVilkår, IVurdering, Vilkårsresultat } from '../Inngangsvilkår/vilkår';
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

const oppfyltBarnMedSamvær = (vilkår: IVilkår, oppfyltAleneomsorgVurderinger: IVurdering[]) => {
    return vilkår.grunnlag.barnMedSamvær.filter((barn) =>
        oppfyltAleneomsorgVurderinger.some((oppfyltBarn) => oppfyltBarn.barnId === barn.barnId)
    );
};

export const harBarnMellomSeksOgTolvMåneder = (vilkår: IVilkår) => {
    const oppfyltAleneomsorgVurderinger = aleneomsorgVurderingerOppfylt(vilkår);
    const barnMedSamvær = oppfyltBarnMedSamvær(vilkår, oppfyltAleneomsorgVurderinger);

    return barnMedSamvær.some((barn) => {
        const barnFødselsdato = barn.registergrunnlag.fødselsdato
            ? new Date(barn.registergrunnlag.fødselsdato)
            : null;

        const nåværendeDato = new Date();

        const alderMåneder = Math.floor(
            barnFødselsdato
                ? (nåværendeDato.getTime() - barnFødselsdato.getTime()) / (1000 * 3600 * 24 * 30)
                : 0
        );
        return alderMåneder >= 6 && alderMåneder <= 12;
    });
};

export const utledAutomatiskBrev = (vilkår: IVilkår, behandling: Behandling) => {
    const harBarnMellomSeksOgTolvMnder = harBarnMellomSeksOgTolvMåneder(vilkår);
    const erOvergangsstønad = behandling.stønadstype === Stønadstype.OVERGANGSSTØNAD;

    const automatiskBrev: AutomatiskBrevValg[] = [];

    if (harBarnMellomSeksOgTolvMnder && erOvergangsstønad) {
        automatiskBrev.push('Varsel om aktivitetsplikt');
    }

    return automatiskBrev;
};
