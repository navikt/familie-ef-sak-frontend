import React, { FC, useEffect, useState } from 'react';
import { Behandling } from '../../../../App/typer/fagsak';
import { IVilkår } from '../../Inngangsvilkår/vilkår';
import styled from 'styled-components';
import { EBehandlingResultat, IInnvilgeVedtakForBarnetilsyn } from '../../../../App/typer/vedtak';
import { useHentVedtak } from '../../../../App/hooks/useHentVedtak';
import { erAlleVilkårOppfylt, skalViseNullstillVedtakKnapp } from '../Felles/utils';
import { RessursStatus } from '../../../../App/typer/ressurs';
import SelectVedtaksresultat from '../Felles/SelectVedtaksresultat';
import DataViewer from '../../../../Felles/DataViewer/DataViewer';
import { Vedtaksform } from './Vedtaksform';
import { AvslåVedtak } from '../Overgangsstønad/AvslåVedtak/AvslåVedtak';
import { Opphør } from '../Overgangsstønad/Opphør/Opphør';
import { barnSomOppfyllerAlleVilkår } from './utils';
import { v4 as uuidv4 } from 'uuid';

interface Props {
    behandling: Behandling;
    vilkår: IVilkår;
}

const Wrapper = styled.div`
    padding: 1rem 2rem;
`;

const WrapperMarginTop = styled.div`
    margin-top: 1rem;
`;

const settEndretKey = (
    vedtak: IInnvilgeVedtakForBarnetilsyn | undefined
): IInnvilgeVedtakForBarnetilsyn | undefined => {
    if (!vedtak) {
        return vedtak;
    }
    return {
        ...vedtak,
        perioder: vedtak.perioder.map((periode) => ({ ...periode, endretKey: uuidv4() })),
        perioderKontantstøtte: vedtak.perioderKontantstøtte.map((periode) => ({
            ...periode,
            endretKey: uuidv4(),
        })),
        tilleggsstønad: {
            ...vedtak.tilleggsstønad,
            perioder: vedtak.tilleggsstønad.perioder.map((periode) => ({
                ...periode,
                endretKey: uuidv4(),
            })),
        },
    };
};

const VedtakOgBeregningBarnetilsyn: FC<Props> = ({ behandling, vilkår }) => {
    const behandlingId = behandling.id;
    const [resultatType, settResultatType] = useState<EBehandlingResultat | undefined>();
    const { vedtak, hentVedtak } = useHentVedtak(behandlingId);

    const alleVilkårOppfylt = erAlleVilkårOppfylt(vilkår);

    useEffect(() => {
        hentVedtak();
    }, [hentVedtak, behandling]);

    useEffect(() => {
        if (vedtak.status === RessursStatus.SUKSESS) {
            settResultatType(vedtak.data?.resultatType);
        }
    }, [vedtak]);

    return (
        <Wrapper>
            <SelectVedtaksresultat
                behandling={behandling}
                resultatType={resultatType}
                settResultatType={settResultatType}
                alleVilkårOppfylt={alleVilkårOppfylt}
                skalViseNullstillVedtakKnapp={skalViseNullstillVedtakKnapp(vedtak)}
            />
            <WrapperMarginTop>
                <DataViewer response={{ vedtak }}>
                    {({ vedtak }) => {
                        switch (resultatType) {
                            case EBehandlingResultat.INNVILGE:
                            case EBehandlingResultat.INNVILGE_UTEN_UTBETALING:
                                return (
                                    <Vedtaksform
                                        behandling={behandling}
                                        lagretVedtak={settEndretKey(
                                            vedtak as IInnvilgeVedtakForBarnetilsyn | undefined // TODO: Fjern "as" når vi får på plass vedtakDto-håndtering(egen oppgave)
                                        )}
                                        barn={barnSomOppfyllerAlleVilkår(vilkår)}
                                        settResultatType={settResultatType}
                                    />
                                );
                            case EBehandlingResultat.AVSLÅ:
                                return (
                                    <AvslåVedtak
                                        behandling={behandling}
                                        alleVilkårOppfylt={alleVilkårOppfylt}
                                        ikkeOppfyltVilkårEksisterer={true}
                                        lagretVedtak={vedtak}
                                    />
                                );
                            case EBehandlingResultat.OPPHØRT:
                                return <Opphør behandlingId={behandlingId} lagretVedtak={vedtak} />;
                            case undefined:
                            default:
                                return null;
                        }
                    }}
                </DataViewer>
            </WrapperMarginTop>
        </Wrapper>
    );
};

export default VedtakOgBeregningBarnetilsyn;
