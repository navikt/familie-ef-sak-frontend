import * as React from 'react';
import { FC } from 'react';
import { IVilkårConfig } from '../Inngangsvilkår/config/VurderingConfig';
import { IDelvilkår, IVurdering, Vilkårsresultat } from '../Inngangsvilkår/vilkår';
import Delvilkår from './Delvilkår';
import Unntak from './Unntak';
import { Textarea } from 'nav-frontend-skjema';
import { VurderingProps } from './VurderingProps';
import LagreVurderingKnapp from './LagreVurderingKnapp';

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

/**
 * Denne skal filtrere ut slik att den viser alle frem till første JA eller første IKKE_VURDERT
 * Denne virker ikke for sivilstand då sivilstand skal vise delvilkår oberoende på tidligere svar?
 * Hvis du svarer:
 * * JA -> ikke vis flere delvilkår
 * * NEI -> vis neste delvilkår
 * * Må vise første delvilkåret (som kan være IKKE_VURDERT)
 * @param delvilkårsvurderinger
 */
const delvilkårSomSkalVises = (delvilkårsvurderinger: IDelvilkår[]) => {
    const sisteDelvilkårSomSkalVises = delvilkårsvurderinger.findIndex(
        (delvilkår) =>
            delvilkår.resultat === Vilkårsresultat.JA ||
            delvilkår.resultat === Vilkårsresultat.IKKE_VURDERT
    );

    // hvis man ikke finner en, så har man ikke besvart på første delvilkåret
    if (sisteDelvilkårSomSkalVises === -1) {
        return delvilkårsvurderinger;
    }
    return delvilkårsvurderinger.slice(
        0,
        // hvis siste delvilkåret er besvart kan vi ikke ta index + 1
        Math.min(sisteDelvilkårSomSkalVises + 1, delvilkårsvurderinger.length)
    );
};

const GenerellVurdering: FC<{
    props: VurderingProps;
}> = ({ props }) => {
    const { config, vurdering, settVurdering, oppdaterVurdering, settRedigeringsmodus } = props;
    const delvilkårsvurderinger = vurdering.delvilkårsvurderinger;
    const sisteDelvilkår: IDelvilkår = delvilkårsvurderinger[delvilkårsvurderinger.length - 1];
    return (
        <>
            {delvilkårSomSkalVises(delvilkårsvurderinger).map((delvilkår) => {
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
            {skalViseLagreKnapp(vurdering, sisteDelvilkår, config) && (
                <LagreVurderingKnapp
                    vurdering={vurdering}
                    oppdaterVurdering={oppdaterVurdering}
                    settRedigeringsmodus={settRedigeringsmodus}
                />
            )}
        </>
    );
};

export default GenerellVurdering;
