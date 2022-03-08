import React from 'react';
import { VilkårProps } from '../../Inngangsvilkår/vilkårprops';
import { AktivitetsvilkårType } from '../../Inngangsvilkår/vilkår';
import ToKolonnerLayout from '../../../../Felles/Visningskomponenter/ToKolonnerLayout';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { Vilkårstittel } from '../../Inngangsvilkår/Vilkårstittel';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';

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
            <AlertStripeFeil>
                OBS: Noe er galt - det finnes ingen vilkår for inntekt for denne behandlingen
            </AlertStripeFeil>
        );
    }

    return (
        <ToKolonnerLayout>
            {{
                venstre: (
                    <>
                        <>
                            <Vilkårstittel
                                tittel="Inntekt"
                                vilkårsresultat={vurdering.resultat}
                                paragrafTittel={'§15-10'}
                            />
                        </>
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
