import React from 'react';
import { VilkårProps } from '../../Inngangsvilkår/vilkårprops';
import { AktivitetsvilkårType } from '../../Inngangsvilkår/vilkår';
import ToKolonnerLayout from '../../../../Felles/Visningskomponenter/ToKolonnerLayout';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { Vilkårstittel } from '../../Inngangsvilkår/Vilkårstittel';
import UtdanningHensiktsmessigInfo from './UtdanningHensiktsmessigInfo';
import { AlertError } from '../../../../Felles/Visningskomponenter/Alerts';

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
        <ToKolonnerLayout>
            {{
                venstre: (
                    <>
                        <Vilkårstittel
                            tittel="Utdanningens nødvendighet og hensiktsmessighet"
                            vilkårsresultat={vurdering.resultat}
                        />
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
        </ToKolonnerLayout>
    );
};
