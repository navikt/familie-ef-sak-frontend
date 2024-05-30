import React from 'react';
import { VilkårPropsMedBehandlingOpprettet } from '../../Inngangsvilkår/vilkårprops';
import { AktivitetsvilkårType } from '../../Inngangsvilkår/vilkår';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { AlertError } from '../../../../Felles/Visningskomponenter/Alerts';
import { Vilkårpanel } from '../../Vilkårpanel/Vilkårpanel';
import { VilkårpanelInnhold } from '../../Vilkårpanel/VilkårpanelInnhold';
import { GrunnbeløpInfoOgSistePeriodeOS } from './GrunnbeløpInfoOgSistePeriodeOS';

export const Inntekt: React.FC<VilkårPropsMedBehandlingOpprettet> = ({
    vurderinger,
    lagreVurdering,
    nullstillVurdering,
    ikkeVurderVilkår,
    feilmeldinger,
    grunnlag,
    behandlingOpprettet,
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
            vilkår={vurdering.vilkårType}
        >
            <VilkårpanelInnhold>
                {{
                    venstre: (
                        <GrunnbeløpInfoOgSistePeriodeOS
                            grunnlag={grunnlag}
                            behandlingOpprettet={behandlingOpprettet}
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
