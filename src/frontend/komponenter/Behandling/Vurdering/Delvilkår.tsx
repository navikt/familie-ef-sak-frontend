import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import {
    delvilkårTypeTilTekst,
    IDelvilkår,
    IVurdering,
    Vilkårsresultat,
    vilkårsresultatTypeTilTekst,
} from '../Inngangsvilkår/vilkår';
import * as React from 'react';
import { FC } from 'react';

interface Props {
    delvilkår: IDelvilkår;
    vurdering: IVurdering;
    settVurdering: (vurdering: IVurdering) => void;
}

const oppdaterDelvilkår = (vurdering: IVurdering, oppdatertDelvilkår: IDelvilkår): IVurdering => {
    let harPassertSisteDelvilkårSomSkalVises = false;
    const delvilkårsvurderinger = vurdering.delvilkårsvurderinger.map((delvilkår) => {
        const skalNullstillePåfølgendeDelvilkår =
            harPassertSisteDelvilkårSomSkalVises &&
            delvilkår.resultat !== Vilkårsresultat.IKKE_VURDERT &&
            delvilkår.resultat !== Vilkårsresultat.IKKE_AKTUELL;

        if (delvilkår.type === oppdatertDelvilkår.type) {
            harPassertSisteDelvilkårSomSkalVises = true;
            return oppdatertDelvilkår;
        } else if (skalNullstillePåfølgendeDelvilkår) {
            return { type: delvilkår.type, resultat: Vilkårsresultat.IKKE_VURDERT };
        } else {
            return delvilkår;
        }
    });
    return {
        ...vurdering,
        delvilkårsvurderinger: delvilkårsvurderinger,
        resultat: oppdatertDelvilkår.resultat,
        unntak: undefined,
    };
};

const Delvilkår: FC<Props> = ({ delvilkår, vurdering, settVurdering }) => {
    return (
        <RadioGruppe key={delvilkår.type} legend={delvilkårTypeTilTekst[delvilkår.type]}>
            {[Vilkårsresultat.JA, Vilkårsresultat.NEI].map((vilkårsresultat) => (
                <Radio
                    key={vilkårsresultat}
                    label={vilkårsresultatTypeTilTekst[vilkårsresultat]}
                    name={delvilkår.type}
                    onChange={() =>
                        settVurdering(
                            oppdaterDelvilkår(vurdering, {
                                type: delvilkår.type,
                                resultat: vilkårsresultat,
                            })
                        )
                    }
                    value={vilkårsresultat}
                    checked={delvilkår.resultat === vilkårsresultat}
                />
            ))}
        </RadioGruppe>
    );
};
export default Delvilkår;
