import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import {
    DelvilkårType,
    delvilkårTypeTilTekst,
    IDelvilkår,
    IVurdering,
    Vilkår,
    Vilkårsresultat,
    VilkårType,
} from '../Inngangsvilkår/vilkår';
import * as React from 'react';
import { FC } from 'react';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { PopoverOrientering } from 'nav-frontend-popover';
import { RadioContainer } from '../../Felleskomponenter/Visning/StyledFormElements';
import {
    delvilkårTypeSomKreverSpesialhåntering,
    vilkårsresultatTypeTilTekstForDelvilkår,
} from '../Inngangsvilkår/vilkårsresultat';

interface Props {
    delvilkår: IDelvilkår;
    vurdering: IVurdering;
    settVurdering: (vurdering: IVurdering) => void;
    hjelpetekst?: React.ReactNode;
}

export const oppdaterDelvilkår = (
    vurdering: IVurdering,
    oppdatertDelvilkår: IDelvilkår
): IVurdering => {
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
        resultat: finnVilkårsresultat(
            vurdering.vilkårType,
            delvilkårsvurderinger,
            oppdatertDelvilkår
        ),
        unntak: undefined,
    };
};

const finnVilkårsresultat = (
    vilkårType: VilkårType,
    delvilkårsvurderinger: IDelvilkår[],
    oppdatertDelvilkår: IDelvilkår
): Vilkårsresultat => {
    if (vilkårType === Vilkår.SAMLIV || vilkårType === Vilkår.ALENEOMSORG) {
        return delvilkårsvurderinger
            .filter((delvilkår) => delvilkår.resultat !== Vilkårsresultat.IKKE_AKTUELL)
            .map((delvilkår) => delvilkår.resultat)
            .reduce((acc, verdi) => {
                if (acc === Vilkårsresultat.IKKE_VURDERT) return Vilkårsresultat.IKKE_VURDERT;
                else if (acc === Vilkårsresultat.IKKE_OPPFYLT) return Vilkårsresultat.IKKE_OPPFYLT;
                else return verdi;
            });
    } else return oppdatertDelvilkår.resultat;
};

const Delvilkår: FC<Props> = ({ delvilkår, vurdering, settVurdering, hjelpetekst }) => {
    return (
        <RadioContainer>
            <RadioGruppe key={delvilkår.type} legend={delvilkårTypeTilTekst[delvilkår.type]}>
                {vilkårsresultatTilVisning(delvilkår.type).map((vilkårsresultat) => (
                    <Radio
                        key={vilkårsresultat}
                        label={vilkårsresultatTypeTilTekstForDelvilkår(
                            vilkårsresultat,
                            delvilkår.type
                        )}
                        name={delvilkår.type}
                        onChange={() =>
                            settVurdering(
                                oppdaterDelvilkår(vurdering, {
                                    ...delvilkår,
                                    type: delvilkår.type,
                                    resultat: vilkårsresultat,
                                    årsak: undefined,
                                })
                            )
                        }
                        value={vilkårsresultat}
                        checked={delvilkår.resultat === vilkårsresultat}
                    />
                ))}
            </RadioGruppe>
            {hjelpetekst && (
                <Hjelpetekst type={PopoverOrientering.Under}>{hjelpetekst}</Hjelpetekst>
            )}
        </RadioContainer>
    );
};

const vilkårsresultatTilVisning = (delvilkårType: DelvilkårType): Vilkårsresultat[] => {
    const muligeValg = [Vilkårsresultat.OPPFYLT, Vilkårsresultat.IKKE_OPPFYLT];
    return delvilkårTypeSomKreverSpesialhåntering.includes(delvilkårType)
        ? muligeValg.reverse()
        : muligeValg;
};
export default Delvilkår;
