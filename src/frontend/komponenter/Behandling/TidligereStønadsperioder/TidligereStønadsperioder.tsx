import * as React from 'react';
import { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import variables from 'nav-frontend-core';
import { useHentVilkår } from '../../../hooks/useHentVilkår';
import {
    DelvilkårType,
    delvilkårTypeTilTekst,
    Vilkår,
    Vilkårsresultat,
    vilkårsresultatTypeTilTekst,
} from '../Inngangsvilkår/vilkår';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import InformasjonsElement from './InformasjonsElement';

const Content = styled.div`
    max-width: 1800px;
    color: ${variables.navMorkGra};
    padding: 1rem 5rem;
`;
const TidligereStønadsperioder: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { hentVilkår, vilkår } = useHentVilkår(behandlingId);

    const hentVilkårCallback = useCallback(() => {
        hentVilkår(behandlingId);
    }, [behandlingId]);

    useEffect(() => {
        hentVilkårCallback();
    }, [hentVilkårCallback]);

    return (
        <DataViewer response={{ vilkår }}>
            {({ vilkår }) => {
                const tidligereVedtaksperioder = vilkår.vurderinger.find(
                    (vurdering) => vurdering.vilkårType === Vilkår.TIDLIGERE_VEDTAKSPERIODER
                );
                const harTidligereMottattOvergansstønad = tidligereVedtaksperioder?.delvilkårsvurderinger.find(
                    (delvilkår) =>
                        delvilkår.type === DelvilkårType.HAR_TIDLIGERE_MOTTATT_OVERGANSSTØNAD
                );
                const harTidligereMottattAndreStønader = tidligereVedtaksperioder?.delvilkårsvurderinger.find(
                    (delvilkår) =>
                        delvilkår.type ===
                        DelvilkårType.HAR_TIDLIGERE_ANDRE_STØNADER_SOM_HAR_BETYDNING
                );
                return (
                    <Content>
                        <InformasjonsElement
                            tittel="Tidligere vedtaksperioder overgangsstønad"
                            spørsmåltekst={
                                delvilkårTypeTilTekst[
                                    DelvilkårType.HAR_TIDLIGERE_MOTTATT_OVERGANSSTØNAD
                                ]
                            }
                            spørsmålsvar={
                                vilkårsresultatTypeTilTekst[
                                    harTidligereMottattOvergansstønad?.resultat ||
                                        Vilkårsresultat.IKKE_VURDERT
                                ]
                            }
                        />
                        <InformasjonsElement
                            tittel="Tidligere vedtaksperioder andre stønader"
                            spørsmåltekst={
                                delvilkårTypeTilTekst[
                                    DelvilkårType.HAR_TIDLIGERE_ANDRE_STØNADER_SOM_HAR_BETYDNING
                                ]
                            }
                            spørsmålsvar={
                                vilkårsresultatTypeTilTekst[
                                    harTidligereMottattAndreStønader?.resultat ||
                                        Vilkårsresultat.IKKE_VURDERT
                                ]
                            }
                            hjelpetekst="Tiden med overgangsstønad løper dersom søker mottar andre løpende ytelser etter folketrygdloven kap.15,
                            herunder ytelser etter tilleggsstønadsforeskriften."
                        />
                    </Content>
                );
            }}
        </DataViewer>
    );
};

export default TidligereStønadsperioder;
