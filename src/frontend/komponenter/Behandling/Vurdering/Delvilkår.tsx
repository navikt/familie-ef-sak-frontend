import { Radio, RadioGruppe } from 'nav-frontend-skjema';
import {
    delvilkårTypeTilTekst,
    IDelvilkår,
    IVurdering,
    Vilkår,
    Vilkårsresultat,
    vilkårsresultatTypeTilTekst,
    VilkårType,
} from '../Inngangsvilkår/vilkår';
import * as React from 'react';
import { FC } from 'react';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { PopoverOrientering } from 'nav-frontend-popover';
import styled from 'styled-components';

interface Props {
    delvilkår: IDelvilkår;
    vurdering: IVurdering;
    settVurdering: (vurdering: IVurdering) => void;
    hjelpetekst?: string;
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
    if (vilkårType === Vilkår.SAMLIV) {
        return delvilkårsvurderinger
            .filter((delvilkår) => delvilkår.resultat !== Vilkårsresultat.IKKE_AKTUELL)
            .map((delvilkår) => delvilkår.resultat)
            .reduce((acc, verdi) => {
                if (acc === Vilkårsresultat.IKKE_VURDERT) return Vilkårsresultat.IKKE_VURDERT;
                else if (acc === Vilkårsresultat.NEI) return Vilkårsresultat.NEI;
                else return verdi;
            });
    } else return oppdatertDelvilkår.resultat;
};

const StyledDelvilkår = styled.div`
    display: flex;

    .radiogruppe {
        width: 26rem;
    }

    .hjelpetekst__innhold {
        max-width: 16rem;
    }
`;

const Delvilkår: FC<Props> = ({ delvilkår, vurdering, settVurdering, hjelpetekst }) => {
    return (
        <StyledDelvilkår>
            <RadioGruppe key={delvilkår.type} legend={delvilkårTypeTilTekst[delvilkår.type]}>
                {[Vilkårsresultat.JA, Vilkårsresultat.NEI].map((vilkårsresultat) => (
                    <Radio
                        key={vilkårsresultat}
                        label={vilkårsresultatTypeTilTekst[vilkårsresultat]}
                        name={delvilkår.type}
                        onChange={() =>
                            settVurdering(
                                oppdaterDelvilkår(vurdering, {
                                    ...delvilkår,
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
            {hjelpetekst && (
                <Hjelpetekst type={PopoverOrientering.Under}>{hjelpetekst}</Hjelpetekst>
            )}
        </StyledDelvilkår>
    );
};
export default Delvilkår;
