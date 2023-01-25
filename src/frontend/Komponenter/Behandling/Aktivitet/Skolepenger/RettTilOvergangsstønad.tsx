import React from 'react';
import { VilkårProps } from '../../Inngangsvilkår/vilkårprops';
import { AktivitetsvilkårType } from '../../Inngangsvilkår/vilkår';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { AlertError } from '../../../../Felles/Visningskomponenter/Alerts';
import { Vilkårpanel } from '../../Vilkårpanel/Vilkårpanel';
import { VilkårpanelInnhold } from '../../Vilkårpanel/VilkårpanelInnhold';
import { EAktivitetsvilkår } from '../../../../App/context/EkspanderbareVilkårpanelContext';

export const RettTilOvergangsstønad: React.FC<VilkårProps> = ({
    vurderinger,
    lagreVurdering,
    nullstillVurdering,
    ikkeVurderVilkår,
    feilmeldinger,
}) => {
    const vurdering = vurderinger.find(
        (v) => v.vilkårType === AktivitetsvilkårType.RETT_TIL_OVERGANGSSTØNAD
    );

    if (!vurdering) {
        return (
            <AlertError>
                OBS: Noe er galt - det finnes ingen vilkår for aktivitet for denne behandlingen
            </AlertError>
        );
    }

    return (
        <Vilkårpanel
            tittel="Rett til overgangsstønad"
            vilkårsresultat={vurdering.resultat}
            vilkår={EAktivitetsvilkår.RETT_TIL_OVERGANGSSTØNAD}
            innhold={
                <VilkårpanelInnhold>
                    {{
                        høyre: (
                            <VisEllerEndreVurdering
                                ikkeVurderVilkår={ikkeVurderVilkår}
                                vurdering={vurdering}
                                feilmelding={feilmeldinger[vurdering.id]}
                                lagreVurdering={lagreVurdering}
                                nullstillVurdering={nullstillVurdering}
                            />
                        ),
                    }}
                </VilkårpanelInnhold>
            }
        />
    );
};
