import React from 'react';
import { InngangsvilkårType } from '../vilkår';
import ToKolonnerLayout from '../../../Felleskomponenter/ToKolonnerLayout';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { VilkårProps } from '../vilkårprops';
import OppholdInfo from './OppholdInfo';
import { Vilkårstittel } from '../Vilkårstittel';

export const Opphold: React.FC<VilkårProps> = ({
    vurderinger,
    grunnlag,
    lagreVurdering,
    nullstillVurdering,
    feilmeldinger,
}) => {
    const vurdering = vurderinger.find((v) => v.vilkårType === InngangsvilkårType.LOVLIG_OPPHOLD);
    if (!vurdering) {
        return <div>Mangler vurdering for opphold</div>;
    }
    return (
        <ToKolonnerLayout>
            {{
                venstre: (
                    <>
                        <Vilkårstittel
                            paragrafTittel="§15-3"
                            tittel="Opphold i Norge"
                            vilkårsresultat={vurdering.resultat}
                        />
                        <OppholdInfo medlemskap={grunnlag.medlemskap} />
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
