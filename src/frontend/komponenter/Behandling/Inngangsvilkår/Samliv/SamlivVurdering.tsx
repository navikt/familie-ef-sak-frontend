import * as React from 'react';
import { FC } from 'react';
import { VurderingProps } from '../../Vurdering/VurderingProps';
import Begrunnelse from '../../Vurdering/Begrunnelse';
import { DelvilkårType, delvilkårTypeTilHjelpetekst, IDelvilkår, Vilkårsresultat } from '../vilkår';
import Delvilkår from '../../Vurdering/Delvilkår';
import LagreVurderingKnapp from '../../Vurdering/LagreVurderingKnapp';

const filtrerDelvilkårSomSkalVises = (delvilkårsvurderinger: IDelvilkår[]): IDelvilkår[] => {
    const sisteDelvilkårSomSkalVises = delvilkårsvurderinger.findIndex(
        (delvilkår) => delvilkår.resultat === Vilkårsresultat.IKKE_VURDERT
    );

    if (sisteDelvilkårSomSkalVises === -1) {
        return delvilkårsvurderinger;
    }
    return delvilkårsvurderinger.slice(0, sisteDelvilkårSomSkalVises + 1);
};

const SamlivVurdering: FC<{ props: VurderingProps }> = ({ props }) => {
    const { vurdering, settVurdering, oppdaterVurdering, lagreknappDisabled } = props;

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
                            hjelpetekst={delvilkårTypeTilHjelpetekst(delvilkår.type)}
                        />
                        <Begrunnelse
                            label={
                                delvilkår.type === DelvilkårType.LEVER_IKKE_MED_ANNEN_FORELDER
                                    ? 'Begrunnelse (valgfritt)'
                                    : 'Begrunnelse'
                            }
                            value={vurdering.begrunnelse || ''}
                            onChange={(e) => {
                                settVurdering({
                                    ...vurdering,
                                    begrunnelse: e.target.value,
                                });
                            }}
                        />
                    </div>
                );
            })}
            <LagreVurderingKnapp lagreVurdering={oppdaterVurdering} disabled={lagreknappDisabled} />
        </>
    );
};
export default SamlivVurdering;
