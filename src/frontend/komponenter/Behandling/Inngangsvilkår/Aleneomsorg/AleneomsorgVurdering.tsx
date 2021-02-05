import React, { FC } from 'react';
import { VurderingProps } from '../../Vurdering/VurderingProps';
import { DelvilkårType, delvilkårTypeTilHjelpetekst, IDelvilkår, Vilkårsresultat } from '../vilkår';
import Delvilkår from '../../Vurdering/Delvilkår';
import Begrunnelse from '../../Vurdering/Begrunnelse';
import LagreVurderingKnapp from '../../Vurdering/LagreVurderingKnapp';
import NæreBoforhold from './NæreBoforhold';

const AleneomsorgVurdering: FC<{ props: VurderingProps }> = ({ props }) => {
    const { vurdering, settVurdering, oppdaterVurdering, lagreknappDisabled } = props;

    const delvilkårsvurderinger: IDelvilkår[] = vurdering.delvilkårsvurderinger.filter(
        (delvilkår) => delvilkår.resultat !== Vilkårsresultat.IKKE_AKTUELL
    );

    return (
        <>
            {delvilkårsvurderinger.map((delvilkår) => {
                return (
                    <div key={delvilkår.type}>
                        <Delvilkår
                            key={delvilkår.type}
                            delvilkår={delvilkår}
                            vurdering={vurdering}
                            settVurdering={settVurdering}
                            hjelpetekst={delvilkårTypeTilHjelpetekst(delvilkår.type)}
                        />
                        {delvilkår.type === DelvilkårType.NÆRE_BOFORHOLD &&
                            delvilkår.resultat === Vilkårsresultat.JA && (
                                <NæreBoforhold
                                    delvilkår={delvilkår}
                                    vurdering={vurdering}
                                    settVurdering={settVurdering}
                                />
                            )}
                        <Begrunnelse
                            label={'Begrunnelse'}
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
                    </div>
                );
            })}

            <LagreVurderingKnapp lagreVurdering={oppdaterVurdering} disabled={lagreknappDisabled} />
        </>
    );
};

export default AleneomsorgVurdering;
