import React, { FC } from 'react';
import { VurderingProps } from '../../Vurdering/VurderingProps';
import Delvilkår from '../../Vurdering/Delvilkår';
import { IDelvilkår, Vilkårsresultat } from '../vilkår';
import { KomponentGruppe } from '../../../Felleskomponenter/Visning/KomponentGruppe';
import Begrunnelse from '../../Vurdering/Begrunnelse';
import LagreVurderingKnapp from '../../Vurdering/LagreVurderingKnapp';
import { manglerBegrunnelse } from '../../Vurdering/VurderingUtil';

const hjelpetekst =
    'Som mor eller far regnes også den som på grunn av dødsfall har fått foreldreansvaret etter barneloven § 38. I slike tilfeller må det foreligge kopi av kjennelsen.';

const skalViseLagreKnappMorEllerFar = (delvilkår: IDelvilkår) => {
    if (
        delvilkår.resultat === Vilkårsresultat.IKKE_OPPFYLT &&
        manglerBegrunnelse(delvilkår.begrunnelse)
    ) {
        return false;
    }
    return delvilkår.resultat !== Vilkårsresultat.IKKE_TATT_STILLING_TIL;
};

const MorEllerFarVurdering: FC<{ props: VurderingProps }> = ({ props }) => {
    const { vurdering, settVurdering, oppdaterVurdering, lagreknappDisabled } = props;
    const delvilkår: IDelvilkår = vurdering.delvilkårsvurderinger[0];
    return (
        <>
            <KomponentGruppe key={delvilkår.type}>
                <Delvilkår
                    key={delvilkår.type}
                    delvilkår={delvilkår}
                    vurdering={vurdering}
                    settVurdering={settVurdering}
                    hjelpetekst={hjelpetekst}
                />
                <Begrunnelse
                    label={
                        delvilkår.resultat === Vilkårsresultat.OPPFYLT
                            ? 'Begrunnelse (hvis aktuelt)'
                            : 'Begrunnelse'
                    }
                    value={delvilkår.begrunnelse || ''}
                    onChange={(e) => {
                        const redigerteDelvilkår = vurdering.delvilkårsvurderinger.map(
                            (delvilkårVurdering: IDelvilkår) => {
                                if (delvilkår.type === delvilkårVurdering.type) {
                                    return {
                                        ...delvilkår,
                                        begrunnelse: e.target.value,
                                    };
                                } else return delvilkårVurdering;
                            }
                        );
                        settVurdering({
                            ...vurdering,
                            delvilkårsvurderinger: redigerteDelvilkår,
                        });
                    }}
                />
            </KomponentGruppe>
            {skalViseLagreKnappMorEllerFar(delvilkår) && (
                <LagreVurderingKnapp
                    lagreVurdering={oppdaterVurdering}
                    disabled={lagreknappDisabled}
                />
            )}
        </>
    );
};
export default MorEllerFarVurdering;
