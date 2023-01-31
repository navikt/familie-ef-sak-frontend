import React from 'react';
import { VilkårProps } from '../../Inngangsvilkår/vilkårprops';
import { AktivitetsvilkårType } from '../../Inngangsvilkår/vilkår';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import SagtOppEllerRedusertInfo from './SagtOppEllerRedusertInfo';
import { AlertError } from '../../../../Felles/Visningskomponenter/Alerts';
import { VilkårpanelInnhold } from '../../Vilkårpanel/VilkårpanelInnhold';
import { Vilkårpanel } from '../../Vilkårpanel/Vilkårpanel';

export const SagtOppEllerRedusert: React.FC<VilkårProps> = ({
    vurderinger,
    grunnlag,
    lagreVurdering,
    ikkeVurderVilkår,
    nullstillVurdering,
    feilmeldinger,
    skalViseSøknadsdata,
}) => {
    const vurdering = vurderinger.find(
        (v) => v.vilkårType === AktivitetsvilkårType.SAGT_OPP_ELLER_REDUSERT
    );
    if (!vurdering) {
        return (
            <AlertError>
                OBS: Noe er galt - det finnes ingen vilkår for "sagt opp eller redusert stilling"
                for denne behandlingen
            </AlertError>
        );
    }
    return (
        <Vilkårpanel
            tittel="Sagt opp arbeidsforhold"
            vilkårsresultat={vurdering.resultat}
            vilkår={vurdering.vilkårType}
        >
            <VilkårpanelInnhold>
                {{
                    venstre: grunnlag.sagtOppEllerRedusertStilling && skalViseSøknadsdata && (
                        <SagtOppEllerRedusertInfo
                            sagtOppEllerRedusert={grunnlag.sagtOppEllerRedusertStilling}
                            skalViseSøknadsdata={skalViseSøknadsdata}
                            dokumentasjon={grunnlag.dokumentasjon}
                        />
                    ),
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
        </Vilkårpanel>
    );
};
