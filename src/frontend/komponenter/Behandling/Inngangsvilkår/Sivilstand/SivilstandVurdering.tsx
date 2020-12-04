import * as React from 'react';
import { FC } from 'react';
import { VurderingProps } from '../../Vurdering/VurderingProps';
import Begrunnelse from '../../Vurdering/Begrunnelse';
import { IDelvilkår, Vilkårsresultat } from '../vilkår';
import Delvilkår from '../../Vurdering/Delvilkår';
import LagreVurderingKnapp from '../../Vurdering/LagreVurderingKnapp';
import {
    harBesvartPåAlleDelvilkår,
    skalViseLagreKnappSivilstand,
} from '../../Vurdering/VurderingUtil';
import Unntak from '../../Vurdering/Unntak';
import { SivilstandType } from '../../../../typer/personopplysninger';

const filtrerDelvilkårSomSkalVises = (delvilkårsvurderinger: IDelvilkår[]): IDelvilkår[] => {
    const sisteDelvilkårSomSkalVises = delvilkårsvurderinger.findIndex(
        (delvilkår) => delvilkår.resultat === Vilkårsresultat.IKKE_VURDERT
    );

    // Hvis siste delvilkåret NEI på siste dekvilkåret så skal man returnere alle
    if (sisteDelvilkårSomSkalVises === -1) {
        return delvilkårsvurderinger;
    }
    return delvilkårsvurderinger.slice(0, sisteDelvilkårSomSkalVises + 1);
};

const SivilstandVurdering: FC<{ props: VurderingProps }> = ({ props }) => {
    const {
        config,
        vurdering,
        settVurdering,
        oppdaterVurdering,
        lagreknappDisabled,
        inngangsvilkår,
    } = props;

    const sivilstandType = inngangsvilkår.grunnlag.sivilstand.registergrunnlag.type;
    const delvilkårsvurderinger: IDelvilkår[] = vurdering.delvilkårsvurderinger.filter(
        (delvilkår) => delvilkår.resultat !== Vilkårsresultat.IKKE_AKTUELL
    );

    const erEnkeOgHarBesvartAlleDelvilkår: boolean =
        harBesvartPåAlleDelvilkår(delvilkårsvurderinger) &&
        sivilstandType === SivilstandType.ENKE_ELLER_ENKEMANN;

    const visBegrunnelse: boolean =
        harBesvartPåAlleDelvilkår(delvilkårsvurderinger) &&
        (sivilstandType !== SivilstandType.ENKE_ELLER_ENKEMANN || vurdering.unntak !== null);
    return (
        <>
            {filtrerDelvilkårSomSkalVises(delvilkårsvurderinger).map((delvilkår) => {
                return (
                    <div key={delvilkår.type}>
                        <Delvilkår
                            key={delvilkår.type}
                            delvilkår={delvilkår}
                            vurdering={vurdering}
                            settVurdering={settVurdering}
                        />
                    </div>
                );
            })}
            {erEnkeOgHarBesvartAlleDelvilkår && (
                <Unntak
                    key={vurdering.id}
                    vurdering={vurdering}
                    settVurdering={settVurdering}
                    unntak={config.unntak}
                />
            )}
            {visBegrunnelse && (
                <Begrunnelse
                    value={vurdering.begrunnelse || ''}
                    onChange={(e) => {
                        settVurdering({
                            ...vurdering,
                            begrunnelse: e.target.value,
                        });
                    }}
                />
            )}
            {skalViseLagreKnappSivilstand(vurdering, config, sivilstandType) && (
                <LagreVurderingKnapp
                    lagreVurdering={oppdaterVurdering}
                    disabled={lagreknappDisabled}
                />
            )}
        </>
    );
};
export default SivilstandVurdering;
