import React from 'react';
import { VilkårProps } from '../../Inngangsvilkår/vilkårprops';
import { AktivitetsvilkårType } from '../../Inngangsvilkår/vilkår';
import ToKolonnerLayout from '../../../../Felles/Visningskomponenter/ToKolonnerLayout';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { Vilkårstittel } from '../../Inngangsvilkår/Vilkårstittel';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import UtdanningHensiktsmessigInfo from './UtdanningHensiktsmessigInfo';

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
