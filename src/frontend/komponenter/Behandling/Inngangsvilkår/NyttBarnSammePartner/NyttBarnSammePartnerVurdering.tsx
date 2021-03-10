import React, { FC } from 'react';
import { VurderingProps } from '../../Vurdering/VurderingProps';
import Delvilkår from '../../Vurdering/Delvilkår';
import { KomponentGruppe } from '../../../Felleskomponenter/Visning/KomponentGruppe';
import LagreVurderingKnapp from '../../Vurdering/LagreVurderingKnapp';

const NyttBarnSammePartnerVurdering: FC<{ props: VurderingProps }> = ({ props }) => {
    const { vurdering, settVurdering, oppdaterVurdering, lagreknappDisabled } = props;
    const nyttBarnSammePartnerVilkår = vurdering.delvilkårsvurderinger[0];
    return (
        <>
            <KomponentGruppe key={nyttBarnSammePartnerVilkår.type}>
                <Delvilkår
                    key={nyttBarnSammePartnerVilkår.type}
                    delvilkår={nyttBarnSammePartnerVilkår}
                    vurdering={vurdering}
                    settVurdering={settVurdering}
                />
            </KomponentGruppe>
            <LagreVurderingKnapp lagreVurdering={oppdaterVurdering} disabled={lagreknappDisabled} />
        </>
    );
};
export default NyttBarnSammePartnerVurdering;
