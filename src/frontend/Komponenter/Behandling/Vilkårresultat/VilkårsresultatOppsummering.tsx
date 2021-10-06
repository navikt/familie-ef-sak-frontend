import React, { useCallback, useEffect } from 'react';
import {
    AktivitetsvilkårType,
    InngangsvilkårType,
    TidligereVedtaksperioderType,
} from '../Inngangsvilkår/vilkår';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { useHentVilkår } from '../../../App/hooks/useHentVilkår';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import { ResultatVisning } from './ResultatVisning';

const Container = styled.div`
    max-width: 1180px;
`;

const InnerContainer = styled.div`
    padding: 1rem;
`;

const TekstWrapper = styled.div`
    padding: 0rem 1rem;
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
                const vurderingerUtenTidligereVedtaksperioder = vilkår.vurderinger.filter(
                    (v) => v.vilkårType !== TidligereVedtaksperioderType.TIDLIGERE_VEDTAKSPERIODER
                );

                const inngangsvilkår = vurderingerUtenTidligereVedtaksperioder.filter(
                    (v) => v.vilkårType in InngangsvilkårType
                );
                const aktivitetsvilkår = vurderingerUtenTidligereVedtaksperioder.filter(
                    (v) => v.vilkårType in AktivitetsvilkårType
                );
                return (
                    <Container>
                        <InnerContainer>
                            <TekstWrapper>
                                <Undertittel className="blokk-xs">
                                    Tidligere vedtaksperioder
                                </Undertittel>
                                <Normaltekst>Søker har ingen tidligere stønadsperioder</Normaltekst>
                            </TekstWrapper>
                            <ResultatVisning
                                vilkårsvurderinger={inngangsvilkår}
                                tittel="Inngangsvilkår"
                            />
                            <ResultatVisning
                                vilkårsvurderinger={aktivitetsvilkår}
                                tittel="Aktivitet"
                            />
                        </InnerContainer>
                    </Container>
                );
            }}
        </DataViewer>
    );
};
