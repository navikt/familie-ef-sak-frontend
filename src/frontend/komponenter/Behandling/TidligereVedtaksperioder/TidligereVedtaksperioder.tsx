import * as React from 'react';
import { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import variables from 'nav-frontend-core';
import { useHentVilkår } from '../../../hooks/useHentVilkår';
import { TidligereVedtaksperioderType } from '../Inngangsvilkår/vilkår';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import InformasjonsElement from './InformasjonsElement';
import { delvilkårTypeTilTekst, svarTypeTilTekst } from '../Vurdering/tekster';

const Container = styled.div`
    max-width: 1800px;
    color: ${variables.navMorkGra};
`;
const TidligereVedtaksperioder: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { hentVilkår, vilkår } = useHentVilkår();

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
                const vurderingTidligereVedtaksperioder = vilkår.vurderinger.find(
                    (vurdering) =>
                        vurdering.vilkårType ===
                        TidligereVedtaksperioderType.TIDLIGERE_VEDTAKSPERIODER
                );
                const harTidligereMottattOvergansstønad = vurderingTidligereVedtaksperioder?.delvilkårsvurderinger.find(
                    (delvilkårvurdering) =>
                        delvilkårvurdering.vurderinger.find(
                            (vurdering) =>
                                vurdering.regelId === 'HAR_TIDLIGERE_MOTTATT_OVERGANSSTØNAD'
                        )
                );
                const harTidligereMottattAndreStønader = vurderingTidligereVedtaksperioder?.delvilkårsvurderinger.find(
                    (delvilkårvurdering) =>
                        delvilkårvurdering.vurderinger.find(
                            (vurdering) =>
                                vurdering.regelId ===
                                'HAR_TIDLIGERE_ANDRE_STØNADER_SOM_HAR_BETYDNING'
                        )
                );
                return (
                    <Container>
                        <InformasjonsElement
                            tittel="Tidligere vedtaksperioder overgangsstønad"
                            spørsmåltekst={
                                delvilkårTypeTilTekst['HAR_TIDLIGERE_MOTTATT_OVERGANSSTØNAD']
                            }
                            spørsmålsvar={
                                svarTypeTilTekst[
                                    harTidligereMottattOvergansstønad?.vurderinger[0].svar ??
                                        'IKKE_OPPFYLT'
                                ]
                            }
                        />
                        <InformasjonsElement
                            tittel="Tidligere vedtaksperioder andre stønader"
                            spørsmåltekst={
                                delvilkårTypeTilTekst[
                                    'HAR_TIDLIGERE_ANDRE_STØNADER_SOM_HAR_BETYDNING'
                                ]
                            }
                            spørsmålsvar={
                                svarTypeTilTekst[
                                    harTidligereMottattAndreStønader?.vurderinger[0].svar ??
                                        'IKKE_OPPFYLT'
                                ]
                            }
                            hjelpetekst="Tiden med overgangsstønad løper dersom søker mottar andre løpende ytelser etter folketrygdloven kap.15,
                            herunder ytelser etter tilleggsstønadsforeskriften."
                        />
                    </Container>
                );
            }}
        </DataViewer>
    );
};

export default TidligereVedtaksperioder;
