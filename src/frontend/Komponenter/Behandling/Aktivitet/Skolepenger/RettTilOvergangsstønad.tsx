import React from 'react';
import { VilkårProps } from '../../Inngangsvilkår/vilkårprops';
import { AktivitetsvilkårType } from '../../Inngangsvilkår/vilkår';
import ToKolonnerLayout from '../../../../Felles/Visningskomponenter/ToKolonnerLayout';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { Vilkårstittel } from '../../Inngangsvilkår/Vilkårstittel';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';

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
            <AlertStripeFeil>
                OBS: Noe er galt - det finnes ingen vilkår for aktivitet for denne behandlingen
            </AlertStripeFeil>
        );
    }

    return (
        <ToKolonnerLayout>
            {{
                venstre: (
                    <>
                        <Vilkårstittel
                            tittel="Rett til overgangsstønad"
                            vilkårsresultat={vurdering.resultat}
                        />
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
