import React from 'react';
import { VilkårProps } from '../../Inngangsvilkår/vilkårprops';
import { AktivitetsvilkårType } from '../../Inngangsvilkår/vilkår';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import UtdanningHensiktsmessigInfo from './UtdanningHensiktsmessigInfo';
import { AlertError } from '../../../../Felles/Visningskomponenter/Alerts';
import { Vilkårpanel } from '../../Vilkårpanel/Vilkårpanel';
import { EAktivitetsvilkår } from '../../../../App/context/EkspanderbareVilkårpanelContext';
import { VilkårpanelInnhold } from '../../Vilkårpanel/VilkårpanelInnhold';

export const UtdanningHensiktsmessig: React.FC<VilkårProps> = ({
    vurderinger,
    lagreVurdering,
    nullstillVurdering,
    ikkeVurderVilkår,
    feilmeldinger,
    grunnlag,
    skalViseSøknadsdata,
}) => {
    const vurdering = vurderinger.find(
        (v) => v.vilkårType === AktivitetsvilkårType.ER_UTDANNING_HENSIKTSMESSIG
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
            tittel="Utdanningens nødvendighet og hensiktsmessighet"
            vilkårsresultat={vurdering.resultat}
            vilkår={EAktivitetsvilkår.UTDANNING_HENSIKTSMESSIG}
        >
            <VilkårpanelInnhold>
                {{
                    venstre: (
                        <>
                            {grunnlag.aktivitet && (
                                <UtdanningHensiktsmessigInfo
                                    aktivitet={grunnlag.aktivitet}
                                    skalViseSøknadsdata={skalViseSøknadsdata}
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
        </Vilkårpanel>
    );
};
