import React from 'react';
import { VilkårPropsMedBehandlingOpprettetOgStønadstype } from '../../Inngangsvilkår/vilkårprops';
import { AktivitetsvilkårType } from '../../Inngangsvilkår/vilkår';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { AlertError } from '../../../../Felles/Visningskomponenter/Alerts';
import { Vilkårpanel } from '../../Vilkårpanel/Vilkårpanel';
import { VilkårpanelInnhold } from '../../Vilkårpanel/VilkårpanelInnhold';
import { IGrunnlagsdataSistePeriodeOvergangsstønad } from '../../TidligereVedtaksperioder/typer';
import SistePeriodeMedOvergangsstønad from '../Inntekt/SistePeriodeMedOvergangsstønad';

export const RettTilOvergangsstønad: React.FC<VilkårPropsMedBehandlingOpprettetOgStønadstype> = ({
    vurderinger,
    lagreVurdering,
    nullstillVurdering,
    ikkeVurderVilkår,
    feilmeldinger,
    grunnlag,
    behandlingOpprettet,
    stønadstype,
}) => {
    const vurdering = vurderinger.find(
        (v) => v.vilkårType === AktivitetsvilkårType.RETT_TIL_OVERGANGSSTØNAD
    );

    const sistePeriodeMedOS: IGrunnlagsdataSistePeriodeOvergangsstønad | undefined =
        grunnlag.tidligereVedtaksperioder.sak?.sistePeriodeMedOvergangsstønad;

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
            vilkår={vurdering.vilkårType}
        >
            <VilkårpanelInnhold>
                {{
                    venstre: (
                        <SistePeriodeMedOvergangsstønad
                            sistePeriodeMedOS={sistePeriodeMedOS}
                            behandlingOpprettet={behandlingOpprettet}
                            stønadstype={stønadstype}
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
