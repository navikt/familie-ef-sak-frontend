import React from 'react';
import { VilkårProps } from '../../Inngangsvilkår/vilkårprops';
import { AktivitetsvilkårType } from '../../Inngangsvilkår/vilkår';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { AlertError } from '../../../../Felles/Visningskomponenter/Alerts';
import { Vilkårpanel } from '../../Vilkårpanel/Vilkårpanel';
import { EAktivitetsvilkår } from '../../../../App/context/EkspanderbareVilkårpanelContext';
import { VilkårpanelInnhold } from '../../Vilkårpanel/VilkårpanelInnhold';

export const Inntekt: React.FC<VilkårProps> = ({
    vurderinger,
    lagreVurdering,
    nullstillVurdering,
    ikkeVurderVilkår,
    feilmeldinger,
}) => {
    const vurdering = vurderinger.find((v) => v.vilkårType === AktivitetsvilkårType.INNTEKT);

    if (!vurdering) {
        return (
            <AlertError>
                OBS: Noe er galt - det finnes ingen vilkår for inntekt for denne behandlingen
            </AlertError>
        );
    }

    return (
        <Vilkårpanel
            tittel="Inntekt"
            vilkårsresultat={vurdering.resultat}
            paragrafTittel={'§15-10'}
            vilkår={EAktivitetsvilkår.INNTEKT}
            innhold={
                <VilkårpanelInnhold>
                    {{
                        venstre: <></>,
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
