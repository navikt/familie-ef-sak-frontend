import React from 'react';
import { InngangsvilkårType } from '../vilkår';
import ToKolonnerLayout from '../../../Felleskomponenter/ToKolonnerLayout';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { VilkårProps } from '../vilkårprops';
import MedlemskapInfo from './MedlemskapInfo';
import { Vilkårstittel } from '../Vilkårstittel';

export const Medlemskap: React.FC<VilkårProps> = ({
    vurderinger,
    grunnlag,
    lagreVurdering,
    nullstillVurdering,
    feilmeldinger,
}) => {
    const vurdering = vurderinger.find(
        (v) => v.vilkårType === InngangsvilkårType.FORUTGÅENDE_MEDLEMSKAP
    );
    if (!vurdering) {
        return <div>Mangler vurdering for forutgående medlemskap</div>;
    }
    return (
        <ToKolonnerLayout>
            {{
                venstre: (
                    <>
                        <Vilkårstittel
                            paragrafTittel="§15-2"
                            tittel="Forutgående medlemskap"
                            vilkårsresultat={vurdering.resultat}
                        />
                        <MedlemskapInfo medlemskap={grunnlag.medlemskap} />
                    </>
                ),
                høyre: (
                    <VisEllerEndreVurdering
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
