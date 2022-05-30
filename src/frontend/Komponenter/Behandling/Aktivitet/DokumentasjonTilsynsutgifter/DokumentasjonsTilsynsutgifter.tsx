import React from 'react';
import ToKolonnerLayout from '../../../../Felles/Visningskomponenter/ToKolonnerLayout';
import VisEllerEndreVurdering from '../../Vurdering/VisEllerEndreVurdering';
import { VilkårProps } from '../../Inngangsvilkår/vilkårprops';
import { Vilkårstittel } from '../../Inngangsvilkår/Vilkårstittel';
import TilsynsutgifterBarnInfo from './TilsynsutgifterBarnInfo';
import { AktivitetsvilkårType } from '../../Inngangsvilkår/vilkår';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';

export const DokumentasjonsTilsynsutgifter: React.FC<VilkårProps> = ({
    vurderinger,
    lagreVurdering,
    nullstillVurdering,
    feilmeldinger,
    grunnlag,
    ikkeVurderVilkår,
    skalViseSøknadsdata,
}) => {
    const vurdering = vurderinger.find(
        (v) => v.vilkårType === AktivitetsvilkårType.DOKUMENTASJON_TILSYNSUTGIFTER
    );

    if (!vurdering) {
        return (
            <AlertStripeFeil>
                Noe er galt - det finnes ingen vilkår for dokumentasjon av tilsynsutgifter
            </AlertStripeFeil>
        );
    }

    return (
        <ToKolonnerLayout>
            {{
                venstre: (
                    <>
                        <Vilkårstittel
                            tittel="Dokumentasjon av tilsynsutgifter"
                            vilkårsresultat={vurdering.resultat}
                        />
                        {grunnlag.barnMedSamvær.map((barn, index) => {
                            return (
                                <TilsynsutgifterBarnInfo
                                    key={index}
                                    gjeldendeBarn={barn}
                                    skalViseSøknadsdata={skalViseSøknadsdata}
                                />
                            );
                        })}
                    </>
                ),
                høyre: (
                    <VisEllerEndreVurdering
                        key={vurdering.id}
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
