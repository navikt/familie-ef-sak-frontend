import React from 'react';
import { VilkårProps } from '../../Inngangsvilkår/vilkårprops';
import { AktivitetsvilkårType } from '../../Inngangsvilkår/vilkår';
import ToKolonnerLayout from '../../../Felleskomponenter/ToKolonnerLayout';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import AktivitetInfo from './AktivitetInfo';
import { Vilkårstittel } from '../../Inngangsvilkår/Vilkårstittel';

export const Aktivitet: React.FC<VilkårProps> = ({
    vurderinger,
    grunnlag,
    lagreVurdering,
    nullstillVurdering,
    ikkeVurderVilkår,
    feilmeldinger,
}) => {
    const vurdering = vurderinger.find((v) => v.vilkårType === AktivitetsvilkårType.AKTIVITET);
    if (!vurdering) {
        return <div>Mangler vurdering for aktivitet</div>;
    }
    return (
        <ToKolonnerLayout>
            {{
                venstre: (
                    <>
                        <Vilkårstittel tittel="Aktivitet" vilkårsresultat={vurdering.resultat} />
                        <AktivitetInfo aktivitet={grunnlag.aktivitet} />
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
