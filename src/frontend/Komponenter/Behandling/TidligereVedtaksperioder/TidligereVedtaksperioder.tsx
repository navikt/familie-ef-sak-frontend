import * as React from 'react';
import { useCallback, useEffect } from 'react';
import { useHentVilkår } from '../../../App/hooks/useHentVilkår';
import { TidligereVedtaksperioderType } from '../Inngangsvilkår/vilkår';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Vilkårstittel } from '../Inngangsvilkår/Vilkårstittel';
import VisEllerEndreVurdering from '../Vurdering/VisEllerEndreVurdering';
import ToKolonnerLayout from '../../../Felles/Visningskomponenter/ToKolonnerLayout';
import TidligereVedtaksperioderInfo from './TidligereVedtaksperioderInfo';

const TidligereVedtaksperioder: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const {
        hentVilkår,
        vilkår,
        ikkeVurderVilkår,
        lagreVurdering,
        feilmeldinger,
        nullstillVurdering,
    } = useHentVilkår();

    const hentVilkårCallback = useCallback(() => {
        hentVilkår(behandlingId);
        // eslint-disable-next-line
    }, [behandlingId]);

    useEffect(() => {
        hentVilkårCallback();
    }, [hentVilkårCallback]);

    return (
        <DataViewer response={{ vilkår }}>
            {({ vilkår }) => {
                const vurdering = vilkår.vurderinger.find(
                    (v) => v.vilkårType === TidligereVedtaksperioderType.TIDLIGERE_VEDTAKSPERIODER
                );
                if (!vurdering) {
                    return <div>Mangler vurdering for tidligere vedtaksperioder</div>;
                }
                return (
                    <>
                        <ToKolonnerLayout>
                            {{
                                venstre: (
                                    <>
                                        <Vilkårstittel
                                            paragrafTittel="§15-8" // TODO: Sjekk om riktig paragraf
                                            tittel="Tidligere vedtaksperioder"
                                            vilkårsresultat={vurdering.resultat}
                                        />
                                        <TidligereVedtaksperioderInfo
                                            tidligereVedtaksperioder={
                                                vilkår.grunnlag.tidligereVedtaksperioder
                                            }
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
                                        venstreKnappetekst={'Vurder'}
                                        høyreKnappetekst={'Ikke vurder'}
                                        tittelTekstVisVurdering={'Vurdert'}
                                    />
                                ),
                            }}
                        </ToKolonnerLayout>
                    </>
                );
            }}
        </DataViewer>
    );
};

export default TidligereVedtaksperioder;
