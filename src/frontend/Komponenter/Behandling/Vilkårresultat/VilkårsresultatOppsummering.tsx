import React, { useCallback, useEffect } from 'react';
import {
    AktivitetsvilkårType,
    InngangsvilkårType,
    TidligereVedtaksperioderType,
} from '../Inngangsvilkår/vilkår';
import { useHentVilkår } from '../../../App/hooks/useHentVilkår';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import { ResultatVisning } from './ResultatVisning';
import TidligereVedtakOppsummering from './TidligereVedtakOppsummering';

const Container = styled.div`
    max-width: 1180px;
`;

const InnerContainer = styled.div`
    padding: 1rem;
`;

export const VilkårsresultatOppsummering: React.FC<{ behandlingId: string }> = ({
    behandlingId,
}) => {
    const { vilkår, hentVilkår } = useHentVilkår();

    const hentVilkårCallback = useCallback(() => {
        hentVilkår(behandlingId);
    }, [behandlingId, hentVilkår]);

    useEffect(() => {
        hentVilkårCallback();
    }, [hentVilkårCallback]);

    return (
        <DataViewer response={{ vilkår }}>
            {({ vilkår }) => {
                const inngangsvilkår = vilkår.vurderinger.filter(
                    (v) => v.vilkårType in InngangsvilkårType
                );
                const aktivitetsvilkår = vilkår.vurderinger.filter(
                    (v) => v.vilkårType in AktivitetsvilkårType
                );
                const tidligereVedtaksvilkår = vilkår.vurderinger.filter(
                    (v) => v.vilkårType in TidligereVedtaksperioderType
                );

                return (
                    <Container>
                        <InnerContainer>
                            <ResultatVisning
                                vilkårsvurderinger={tidligereVedtaksvilkår}
                                tittel="Tidligere vedtaksperioder"
                            />
                            <ResultatVisning
                                vilkårsvurderinger={inngangsvilkår}
                                tittel="Inngangsvilkår"
                            />
                            <ResultatVisning
                                vilkårsvurderinger={aktivitetsvilkår}
                                tittel="Aktivitet"
                            />
                            <TidligereVedtakOppsummering
                                tidligereVedtaksvilkår={tidligereVedtaksvilkår}
                            />
                        </InnerContainer>
                    </Container>
                );
            }}
        </DataViewer>
    );
};
