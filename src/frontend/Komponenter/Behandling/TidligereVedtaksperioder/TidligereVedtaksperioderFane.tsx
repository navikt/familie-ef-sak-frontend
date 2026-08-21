import * as React from 'react';
import { useEffect } from 'react';
import { TidligereVedtaksperioderType } from '../Inngangsvilkår/vilkår';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import VisEllerEndreVurdering from '../Vurdering/VisEllerEndreVurdering';
import TidligereVedtaksperioderInfo from './TidligereVedtaksperioderInfo';
import { useBehandling } from '../../../App/context/BehandlingContext';
import VilkårIkkeOpprettetAlert from '../Vurdering/VilkårIkkeOpprettet';
import { Behandling } from '../../../App/typer/fagsak';
import { Box } from '@navikt/ds-react';
import { BehandleSom2026Regelendring } from '../Vurdering/BehandleSom2026Regelendring.tsx';
import { Vilkårpanel } from '../Vilkårpanel/Vilkårpanel';
import { VilkårpanelInnhold } from '../Vilkårpanel/VilkårpanelInnhold';

interface Props {
    behandling: Behandling;
}

export const TidligereVedtaksperioderFane: React.FC<Props> = ({ behandling }) => {
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
        hentVilkår(behandling.id);
    }, [hentVilkår, behandling.id]);

    return (
        <DataViewer response={{ vilkår }}>
            {({ vilkår }) => {
                const vurdering = vilkår.vurderinger.find(
                    (v) => v.vilkårType === TidligereVedtaksperioderType.TIDLIGERE_VEDTAKSPERIODER
                );
                if (vilkår.vurderinger.length === 0) {
                    return <VilkårIkkeOpprettetAlert />;
                }
                if (!vurdering) {
                    return <div>Mangler vurdering for tidligere vedtaksperioder</div>;
                }
                return (
                    <Box paddingBlock="space-16 space-0">
                        <Vilkårpanel
                            paragrafTittel="§15-8"
                            tittel="Tidligere vedtaksperioder"
                            vilkårsresultat={vurdering.resultat}
                            vilkår={vurdering.vilkårType}
                        >
                            <VilkårpanelInnhold>
                                {{
                                    venstre: (
                                        <TidligereVedtaksperioderInfo
                                            tidligereVedtaksperioder={
                                                vilkår.grunnlag.tidligereVedtaksperioder
                                            }
                                        />
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
                            </VilkårpanelInnhold>
                        </Vilkårpanel>

                        <Box background="neutral-soft" style={{ margin: '0 2rem 2rem 2rem' }}>
                            <BehandleSom2026Regelendring />
                        </Box>
                    </Box>
                );
            }}
        </DataViewer>
    );
};
