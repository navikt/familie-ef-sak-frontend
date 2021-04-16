import React, { useEffect } from 'react';
import { RessursStatus } from '../../typer/ressurs';
import { Steg } from '../Høyremeny/Steg';
import {
    AktivitetsvilkårType,
    InngangsvilkårType,
    TidligereVedtaksperioderType,
} from '../Behandling/Inngangsvilkår/vilkår';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { useBehandling } from '../../context/BehandlingContext';
import { useHentVilkår } from '../../hooks/useHentVilkår';
import DataViewer from '../Felleskomponenter/DataViewer/DataViewer';
import styled from 'styled-components';
import { ResultatVisning } from './ResultatVisning';

export function withResultatSammendrag<PROPS>(Component: React.ComponentType<PROPS>) {
    return (props: PROPS & { behandlingId: string }) => {
        const { behandling } = useBehandling();
        const { behandlingId, ...rest } = props as any;
        if (behandling.status === RessursStatus.SUKSESS && behandling.data.steg === Steg.VILKÅR) {
            return <VilkårsresultatOppsummering behandlingId={behandlingId} />;
        }
        return <Component {...rest} />;
    };
}

const Container = styled.div`
    max-width: 1180px;
`;

const InnerContainer = styled.div`
    padding: 1.5rem;
`;

const VilkårsresultatOppsummering: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { vilkår, hentVilkår } = useHentVilkår();

    useEffect(() => {
        hentVilkår(behandlingId);
    }, [behandlingId]);

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
                            <div style={{ padding: '2rem 1rem' }}>
                                <Undertittel className="blokk-xs">
                                    Tidligere stønadsperioder
                                </Undertittel>
                                <Normaltekst>Søker har ingen tidligere stønadsperioder</Normaltekst>
                            </div>
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
