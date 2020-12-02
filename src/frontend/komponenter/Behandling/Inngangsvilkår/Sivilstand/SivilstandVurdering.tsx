import * as React from 'react';
import { FC } from 'react';
import { VurderingProps } from '../../Vurdering/VurderingProps';
import Begrunnelse from '../../Vurdering/Begrunnelse';
import { DelvilkårType, IDelvilkår, Vilkårsresultat } from '../vilkår';
import { ISivilstandInngangsvilkår } from './typer';
import { SivilstandType } from '../../../../typer/personopplysninger';
import Delvilkår from '../../Vurdering/Delvilkår';
import LagreVurderingKnapp from '../../Vurdering/LagreVurderingKnapp';
import { skalViseLagreKnapp } from '../../Vurdering/VurderingUtil';

const filtrerBortUaktuelleDelvilkår = (
    delvilkårsvurderinger: IDelvilkår[],
    sivilstandInngangsvilkår: ISivilstandInngangsvilkår
): IDelvilkår[] => {
    const { søknadsgrunnlag, registergrunnlag } = sivilstandInngangsvilkår;
    return delvilkårsvurderinger.filter((delvilkår) => {
        switch (delvilkår.type) {
            case DelvilkårType.DOKUMENTERT_EKTESKAP:
                return (
                    [SivilstandType.UGIFT].includes(registergrunnlag.type) &&
                    søknadsgrunnlag.erUformeltGift
                );
            case DelvilkårType.DOKUMENTERT_SEPARASJON_ELLER_SKILSMISSE:
                return (
                    [SivilstandType.UGIFT].includes(registergrunnlag.type) &&
                    søknadsgrunnlag.erUformeltSeparertEllerSkilt
                );

            case DelvilkårType.SAMLIVSBRUDD_LIKESTILT_MED_SEPARASJON:
                return (
                    [SivilstandType.GIFT, SivilstandType.REGISTRERT_PARTNER].includes(
                        registergrunnlag.type
                    ) && søknadsgrunnlag.søktOmSkilsmisseSeparasjon
                );
            case DelvilkårType.SAMSVAR_DATO_SEPARASJON_OG_FRAFLYTTING:
                return [SivilstandType.SEPARERT, SivilstandType.SEPARERT_PARTNER].includes(
                    registergrunnlag.type
                );

            case DelvilkårType.KRAV_SIVILSTAND:
                return (
                    [SivilstandType.UGIFT, SivilstandType.UOPPGITT].includes(
                        registergrunnlag.type
                    ) &&
                    (søknadsgrunnlag.erUformeltSeparertEllerSkilt || søknadsgrunnlag.erUformeltGift)
                );

            default:
                return false;
        }
    });
};

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
    const {
        config,
        vurdering,
        settVurdering,
        oppdaterVurdering,
        lagreknappDisabled,
        inngangsvilkår,
    } = props;
    const delvilkårsvurderinger = filtrerBortUaktuelleDelvilkår(
        vurdering.delvilkårsvurderinger,
        inngangsvilkår.grunnlag.sivilstand
    );

    console.log(delvilkårsvurderinger);

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
