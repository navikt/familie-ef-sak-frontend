import * as React from 'react';
import { useEffect } from 'react';
import { TidligereVedtaksperioderType } from '../Inngangsvilkår/vilkår';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Vilkårstittel } from '../Inngangsvilkår/Vilkårstittel';
import VisEllerEndreVurdering from '../Vurdering/VisEllerEndreVurdering';
import ToKolonnerLayout from '../../../Felles/Visningskomponenter/ToKolonnerLayout';
import TidligereVedtaksperioderInfo from './TidligereVedtaksperioderInfo';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { RessursStatus } from '../../../App/typer/ressurs';

const TidligereVedtaksperioder: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { vilkårState } = useBehandling();
    const {
        hentVilkår,
        vilkår,
        ikkeVurderVilkår,
        lagreVurdering,
        feilmeldinger,
        nullstillVurdering,
    } = vilkårState;

    useEffect(() => {
        if (vilkår.status === RessursStatus.IKKE_HENTET) {
            hentVilkår(behandlingId);
        }
        // eslint-disable-next-line
    }, [behandlingId]);

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
