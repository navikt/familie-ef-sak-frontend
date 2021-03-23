import * as React from 'react';
import { FC } from 'react';
import { VurderingProps } from '../../Vurdering/VurderingProps';
import Begrunnelse from '../../Vurdering/Begrunnelse';
import { DelvilkårType, IDelvilkår, Vilkårsresultat } from '../vilkår';
import Delvilkår from '../../Vurdering/Delvilkår';
import LagreVurderingKnapp from '../../Vurdering/LagreVurderingKnapp';
import {
    harBesvartPåAlleDelvilkår,
    skalViseLagreKnappSivilstand,
} from '../../Vurdering/VurderingUtil';
import Unntak from '../../Vurdering/Unntak';
import {
    erEnkeEllerGjenlevendePartner,
    erGiftSeparertEllerEnke,
    erSkiltOgKravIkkeOppfylt,
} from './SivilstandHelper';
import { KomponentGruppe } from '../../../Felleskomponenter/Visning/KomponentGruppe';

const filtrerDelvilkårSomSkalVises = (delvilkårsvurderinger: IDelvilkår[]): IDelvilkår[] => {
    const sisteDelvilkårSomSkalVises = delvilkårsvurderinger.findIndex(
        (delvilkår) => delvilkår.resultat === Vilkårsresultat.IKKE_VURDERT
    );

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
        inngangsvilkårgrunnlag,
    } = props;

    const søknadsgrunnlag = inngangsvilkårgrunnlag.sivilstand.søknadsgrunnlag;
    const sivilstandType = inngangsvilkårgrunnlag.sivilstand.registergrunnlag.type;
    const delvilkårsvurderinger: IDelvilkår[] = vurdering.delvilkårsvurderinger.filter(
        (delvilkår) => delvilkår.resultat !== Vilkårsresultat.IKKE_AKTUELL
    );
    const { erUformeltGift, erUformeltSeparertEllerSkilt } = søknadsgrunnlag;

    const erGiftEllerSkiltIUtlandet = erUformeltGift || erUformeltSeparertEllerSkilt;
    const erObligatoriskHvisSivilstand: boolean = erGiftSeparertEllerEnke(sivilstandType);

    const kravOmSivilstand: IDelvilkår | undefined = vurdering.delvilkårsvurderinger.find(
        (delvilkårvurdering) => delvilkårvurdering.type === DelvilkårType.KRAV_SIVILSTAND
    );

    const erBegrunnelseObligatorisk: boolean | undefined =
        erGiftEllerSkiltIUtlandet ||
        erObligatoriskHvisSivilstand ||
        (kravOmSivilstand && erSkiltOgKravIkkeOppfylt(sivilstandType, kravOmSivilstand));

    const visUnntak: boolean =
        harBesvartPåAlleDelvilkår(delvilkårsvurderinger) &&
        erEnkeEllerGjenlevendePartner(sivilstandType);

    const visBegrunnelse: boolean =
        harBesvartPåAlleDelvilkår(delvilkårsvurderinger) &&
        (!erEnkeEllerGjenlevendePartner(sivilstandType) || vurdering.unntak !== null);

    return (
        <>
            {filtrerDelvilkårSomSkalVises(delvilkårsvurderinger).map((delvilkår) => {
                return (
                    <KomponentGruppe key={delvilkår.type}>
                        <Delvilkår
                            key={delvilkår.type}
                            delvilkår={delvilkår}
                            vurdering={vurdering}
                            settVurdering={settVurdering}
                        />
                    </KomponentGruppe>
                );
            })}
            {visUnntak && (
                <Unntak
                    key={vurdering.id}
                    vurdering={vurdering}
                    settVurdering={settVurdering}
                    unntak={config.unntak}
                />
            )}
            {visBegrunnelse && (
                <Begrunnelse
                    label={erBegrunnelseObligatorisk ? 'Begrunnelse' : 'Begrunnelse (hvis aktuelt)'}
                    value={vurdering.begrunnelse || ''}
                    onChange={(e) => {
                        settVurdering({
                            ...vurdering,
                            begrunnelse: e.target.value,
                        });
                    }}
                />
            )}
            {skalViseLagreKnappSivilstand(
                vurdering,
                sivilstandType,
                erBegrunnelseFeltValgfritt
            ) && (
                <LagreVurderingKnapp
                    lagreVurdering={oppdaterVurdering}
                    disabled={lagreknappDisabled}
                />
            )}
        </>
    );
};
export default SivilstandVurdering;
