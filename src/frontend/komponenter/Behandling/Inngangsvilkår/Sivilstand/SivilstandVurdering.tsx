import * as React from 'react';
import { FC } from 'react';
import { VurderingProps } from '../../Vurdering/VurderingProps';
import Begrunnelse from '../../Vurdering/Begrunnelse';
import { DelvilkårType, IDelvilkår, Vilkårsresultat } from '../vilkår';
import Delvilkår from '../../Vurdering/Delvilkår';
import LagreVurderingKnapp from '../../Vurdering/LagreVurderingKnapp';
import { skalViseLagreKnapp } from '../../Vurdering/VurderingUtil';

const visBegrunnelse = (delvilkårType: DelvilkårType): boolean => {
    return (
        delvilkårType === DelvilkårType.KRAV_SIVILSTAND ||
        delvilkårType === DelvilkårType.SAMLIVSBRUDD_LIKESTILT_MED_SEPARASJON ||
        delvilkårType === DelvilkårType.SAMSVAR_DATO_SEPARASJON_OG_FRAFLYTTING
    );
};

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
    const { config, vurdering, settVurdering, oppdaterVurdering, lagreknappDisabled } = props;
    const delvilkårsvurderinger: IDelvilkår[] = vurdering.delvilkårsvurderinger.filter(
        (delvilkår) => delvilkår.resultat !== Vilkårsresultat.IKKE_AKTUELL
    );

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
                        {visBegrunnelse(delvilkår.type) && (
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
                    </div>
                );
            })}

            {skalViseLagreKnapp(vurdering, config) && (
                <LagreVurderingKnapp
                    lagreVurdering={oppdaterVurdering}
                    disabled={lagreknappDisabled}
                />
            )}
        </>
    );
};
export default SivilstandVurdering;
