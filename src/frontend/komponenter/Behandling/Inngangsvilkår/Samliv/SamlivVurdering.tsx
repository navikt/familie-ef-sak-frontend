import * as React from 'react';
import { FC } from 'react';
import { VurderingProps } from '../../Vurdering/VurderingProps';
import Begrunnelse from '../../Vurdering/Begrunnelse';
import { DelvilkårType, IDelvilkår, Vilkårsresultat } from '../vilkår';
import Delvilkår from '../../Vurdering/Delvilkår';
import LagreVurderingKnapp from '../../Vurdering/LagreVurderingKnapp';
import { manglerBegrunnelse } from '../../Vurdering/VurderingUtil';
import { KomponentGruppe } from '../../../Felleskomponenter/Visning/KomponentGruppe';

const hjelpetekst =
    'Bor ikke i samme hus, har ikke omfattende tilknytning til samme bolig, har ikke konkrete fremtidsplaner mv, midlertidig adskillelse, krav til brudd oppfylt dersom foreldrene har bodd sammen';

const skalViseLagreKnappSamliv = (delvilkårsvurderinger: IDelvilkår[]) => {
    return delvilkårsvurderinger.every((delvilkår) => {
        if (
            [DelvilkårType.LEVER_IKKE_I_EKTESKAPLIGNENDE_FORHOLD].includes(delvilkår.type) &&
            manglerBegrunnelse(delvilkår.begrunnelse)
        ) {
            return false;
        }
        return delvilkår.resultat !== Vilkårsresultat.IKKE_TATT_STILLING_TIL;
    });
};

const SamlivVurdering: FC<{ props: VurderingProps }> = ({ props }) => {
    const { vurdering, settVurdering, oppdaterVurdering, lagreknappDisabled } = props;

    const delvilkårsvurderinger: IDelvilkår[] = vurdering.delvilkårsvurderinger.filter(
        (delvilkår) => delvilkår.resultat !== Vilkårsresultat.IKKE_AKTUELL
    );

    return (
        <>
            {delvilkårsvurderinger.map((delvilkår) => {
                return (
                    <KomponentGruppe key={delvilkår.type}>
                        <Delvilkår
                            key={delvilkår.type}
                            delvilkår={delvilkår}
                            vurdering={vurdering}
                            settVurdering={settVurdering}
                            hjelpetekst={
                                delvilkår.type === DelvilkårType.LEVER_IKKE_MED_ANNEN_FORELDER &&
                                hjelpetekst
                            }
                        />
                        <Begrunnelse
                            label={
                                delvilkår.type === DelvilkårType.LEVER_IKKE_MED_ANNEN_FORELDER
                                    ? 'Begrunnelse (valgfritt)'
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
                );
            })}
            {skalViseLagreKnappSamliv(delvilkårsvurderinger) && (
                <LagreVurderingKnapp
                    lagreVurdering={oppdaterVurdering}
                    disabled={lagreknappDisabled}
                />
            )}
        </>
    );
};
export default SamlivVurdering;
