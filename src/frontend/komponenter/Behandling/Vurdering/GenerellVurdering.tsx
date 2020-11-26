import * as React from 'react';
import { FC } from 'react';
import { IVilkårConfig } from '../Inngangsvilkår/config/VurderingConfig';
import { IDelvilkår, IVurdering, Vilkårsresultat } from '../Inngangsvilkår/vilkår';
import Delvilkår from './Delvilkår';
import Unntak from './Unntak';
import { Textarea } from 'nav-frontend-skjema';
import { VurderingProps } from './VurderingProps';

const skalViseLagreKnapp = (
    vurdering: IVurdering,
    sisteDelvilkår: IDelvilkår,
    config: IVilkårConfig
): boolean => {
    const besvarteDelvilkår = vurdering.delvilkårsvurderinger.filter(
        (delvilkår) =>
            delvilkår.resultat === Vilkårsresultat.NEI || delvilkår.resultat === Vilkårsresultat.JA
    );
    const sisteBesvarteDelvilkår =
        besvarteDelvilkår.length > 0 ? besvarteDelvilkår[besvarteDelvilkår.length - 1] : undefined;
    if (sisteBesvarteDelvilkår?.resultat === Vilkårsresultat.JA) {
        return true;
    }
    if (
        sisteDelvilkår === sisteBesvarteDelvilkår &&
        sisteDelvilkår.resultat !== Vilkårsresultat.IKKE_VURDERT
    ) {
        if (config.unntak.length === 0) {
            return true;
        } else {
            return !!vurdering.unntak;
        }
    }
    return false;
};

const GenerellVurdering: FC<{
    props: VurderingProps;
}> = ({ props }) => {
    const { config, vurdering, settVurdering, lagreKnapp } = props;
    const delvilkårsvurderinger = vurdering.delvilkårsvurderinger;
    const nesteDelvilkårSomManglerVurdering = delvilkårsvurderinger.find(
        (delvilkår) => delvilkår.resultat === Vilkårsresultat.IKKE_VURDERT
    );
    let harPassertSisteDelvilkårSomSkalVises = false;
    const sisteDelvilkår: IDelvilkår = delvilkårsvurderinger[delvilkårsvurderinger.length - 1];
    return (
        <>
            {delvilkårsvurderinger.map((delvilkår) => {
                if (harPassertSisteDelvilkårSomSkalVises) {
                    return null;
                }
                if (
                    nesteDelvilkårSomManglerVurdering?.type === delvilkår.type ||
                    delvilkår.resultat === Vilkårsresultat.JA
                ) {
                    harPassertSisteDelvilkårSomSkalVises = true;
                }
                return (
                    <Delvilkår
                        key={delvilkår.type}
                        delvilkår={delvilkår}
                        vurdering={vurdering}
                        settVurdering={settVurdering}
                    />
                );
            })}
            {config.unntak.length > 0 && sisteDelvilkår.resultat === Vilkårsresultat.NEI && (
                <Unntak
                    key={vurdering.id}
                    vurdering={vurdering}
                    settVurdering={settVurdering}
                    unntak={config.unntak}
                />
            )}
            <Textarea
                label="Begrunnelse"
                maxLength={0}
                placeholder="Skriv inn tekst"
                value={vurdering.begrunnelse || ''}
                onChange={(e) => {
                    settVurdering({
                        ...vurdering,
                        begrunnelse: e.target.value,
                    });
                }}
            />
            {lagreKnapp(skalViseLagreKnapp(vurdering, sisteDelvilkår, config))}
        </>
    );
};

export default GenerellVurdering;
