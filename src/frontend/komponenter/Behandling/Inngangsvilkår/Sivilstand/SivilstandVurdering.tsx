import * as React from 'react';
import { FC } from 'react';
import { VurderingProps } from '../../Vurdering/VurderingProps';
import Begrunnelse from '../../Vurdering/Begrunnelse';
import { DelvilkårType, IDelvilkår } from '../vilkår';
import { ISivilstandInngangsvilkår } from './typer';
import { SivilstandType } from '../../../../typer/personopplysninger';
import Delvilkår from '../../Vurdering/Delvilkår';

/**
 * ANTAGELSE:
 * - Har delvilkår som skal vurderes
 *
 * Vis delvilkår ut ifra hvilken sivilstatus og om de har svart ja
 * på oppfølgingsspørsmålene som kommer med sivilstatusen.
 */
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
            case DelvilkårType.KRAV_SIVILSTAND:
                return (
                    [SivilstandType.UGIFT].includes(registergrunnlag.type) &&
                    (søknadsgrunnlag.erUformeltSeparertEllerSkilt || søknadsgrunnlag.erUformeltGift)
                );
            default:
                return false;
        }
    });
};

// const filtrerDelvilkårSomSkalVises = (delvilkårsvurderinger: IDelvilkår[], sivilstandInngangsvilkår: ISivilstandInngangsvilkår) => {
//     const {søknadsgrunnlag, registergrunnlag} = sivilstandInngangsvilkår;
//
//
//     const delvilkårSomSkalVises = delvilkårsvurderinger;
//     return delvilkårSomSkalVises;
// }

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

    return (
        <>
            {delvilkårsvurderinger.map((delvilkår) => {
                return (
                    <Delvilkår
                        key={delvilkår.type}
                        delvilkår={delvilkår}
                        vurdering={vurdering}
                        settVurdering={settVurdering}
                    />
                );
            })}
            {/**
             Begrunnelse skal bare dukke opp dersom det ikke er noen delvilkår å svare på,
             eller hvis saksbehandler har svart NEI på "Er delvilkår oppfylt?"
             KAN HENDE VI FÅR TIL NOE I BACKEND, VENT MED DENNE
             */}
            <Begrunnelse
                value={vurdering.begrunnelse || ''}
                onChange={(e) => {
                    settVurdering({
                        ...vurdering,
                        begrunnelse: e.target.value,
                    });
                }}
            />
            {/**
             Valider ut ifra status og svar, og vis lagre knappen kun
             hvis alt er validert riktig

             VIS LAGRE KNAPP
             */}
        </>
    );
};
export default SivilstandVurdering;
