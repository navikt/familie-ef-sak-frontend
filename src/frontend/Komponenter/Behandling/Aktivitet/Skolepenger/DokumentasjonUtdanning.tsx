import React from 'react';
import { VilkårProps } from '../../Inngangsvilkår/vilkårprops';
import { AktivitetsvilkårType } from '../../Inngangsvilkår/vilkår';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import DokumentasjonUtdanningInfo from './DokumentasjonUtdanningInfo';
import { AlertError } from '../../../../Felles/Visningskomponenter/Alerts';
import { Vilkårpanel } from '../../Vilkårpanel/Vilkårpanel';
import { EAktivitetsvilkår } from '../../../../App/context/EkspanderbareVilkårpanelContext';
import { VilkårpanelInnhold } from '../../Vilkårpanel/VilkårpanelInnhold';

export const DokumentasjonUtdanning: React.FC<VilkårProps> = ({
    vurderinger,
    lagreVurdering,
    nullstillVurdering,
    ikkeVurderVilkår,
    feilmeldinger,
    grunnlag,
    skalViseSøknadsdata,
}) => {
    const vurdering = vurderinger.find(
        (v) => v.vilkårType === AktivitetsvilkårType.DOKUMENTASJON_AV_UTDANNING
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
            tittel="Dokumentasjon av utdanning og utgifter"
            vilkårsresultat={vurdering.resultat}
            vilkår={EAktivitetsvilkår.DOKUMENTASJON_UTDANNING}
            innhold={
                <VilkårpanelInnhold>
                    {{
                        venstre: (
                            <>
                                {grunnlag.aktivitet && (
                                    <DokumentasjonUtdanningInfo
                                        aktivitet={grunnlag.aktivitet}
                                        skalViseSøknadsdata={skalViseSøknadsdata}
                                        dokumentasjon={grunnlag.dokumentasjon}
                                    />
                                )}
                            </>
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
            }
        />
    );
};
