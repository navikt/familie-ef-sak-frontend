import * as React from 'react';
import { FC } from 'react';
import { IVilkårConfig } from '../Inngangsvilkår/config/VurderingConfig';
import { IDelvilkår, IVurdering, Vilkårsresultat } from '../Inngangsvilkår/vilkår';
import Delvilkår from './Delvilkår';
import Unntak from './Unntak';
import { Textarea } from 'nav-frontend-skjema';
import { VurderingProps } from './VurderingProps';
import LagreVurderingKnapp from './LagreVurderingKnapp';

const skalViseLagreKnapp = (vurdering: IVurdering, config: IVilkårConfig): boolean => {
    const { begrunnelse, delvilkårsvurderinger } = vurdering;
    // Må alltid ha med begrunnelse
    if (!begrunnelse || begrunnelse.trim().length === 0) {
        return false;
    }
    const besvarteDelvilkår = delvilkårsvurderinger.filter(
        (delvilkår) =>
            delvilkår.resultat === Vilkårsresultat.NEI || delvilkår.resultat === Vilkårsresultat.JA
    );
    //Må ha besvart minimum 1 delvilkår
    if (besvarteDelvilkår.length === 0) {
        return false;
    }
    const sisteBesvarteDelvilkår = besvarteDelvilkår[besvarteDelvilkår.length - 1];

    const vurderingErOppfylt = sisteBesvarteDelvilkår.resultat === Vilkårsresultat.JA;
    const harBesvaretPåAlleDelvilkår = delvilkårsvurderinger.every(
        (delvilkår) => delvilkår.resultat !== Vilkårsresultat.IKKE_VURDERT
    );

    if (vurderingErOppfylt) {
        return true;
    } else if (harBesvaretPåAlleDelvilkår) {
        const harUnntak = config.unntak.length !== 0;
        return harUnntak ? !!vurdering.unntak : true;
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
const filtrerDelvilkårSomSkalVises = (delvilkårsvurderinger: IDelvilkår[]) => {
    const sisteDelvilkårSomSkalVises = delvilkårsvurderinger.findIndex(
        (delvilkår) =>
            delvilkår.resultat === Vilkårsresultat.JA ||
            delvilkår.resultat === Vilkårsresultat.IKKE_VURDERT
    );

    // Hvis siste delvilkåret NEI på siste dekvilkåret så skal man returnere alle
    if (sisteDelvilkårSomSkalVises === -1) {
        return delvilkårsvurderinger;
    }
    return delvilkårsvurderinger.slice(0, sisteDelvilkårSomSkalVises + 1);
};

const GenerellVurdering: FC<{
    props: VurderingProps;
}> = ({ props }) => {
    const { config, vurdering, settVurdering, oppdaterVurdering, lagreknappDisabled } = props;
    const delvilkårsvurderinger = vurdering.delvilkårsvurderinger;
    const sisteDelvilkår: IDelvilkår = delvilkårsvurderinger[delvilkårsvurderinger.length - 1];
    return (
        <>
            {filtrerDelvilkårSomSkalVises(delvilkårsvurderinger).map((delvilkår) => {
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
            {skalViseLagreKnapp(vurdering, config) && (
                <LagreVurderingKnapp
                    lagreVurdering={oppdaterVurdering}
                    disabled={lagreknappDisabled}
                />
            )}
        </>
    );
};

export default GenerellVurdering;
