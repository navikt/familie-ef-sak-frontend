import React, { FC, useEffect, useState } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Steg } from '../Høyremeny/Steg';
import styled from 'styled-components';
import { VedtaksoppsummeringOvergangsstønad } from './Overgangsstønad/VedtaksoppsummeringOvergangsstønad';
import VedtakOgBeregningOvergangsstønad from './Overgangsstønad/VedtakOgBeregningOvergangsstønad';
import VedtakOgBeregningBarnetilsyn from './Barnetilsyn/VedtakOgBeregningBarnetilsyn';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import { IVilkår } from '../Inngangsvilkår/vilkår';
import { Behandling } from '../../../App/typer/fagsak';
import { VedtaksoppsummeringBarnetilsyn } from './Barnetilsyn/VedtaksoppsummeringBarnetilsyn';
import VedtakOgBeregningSkolepenger from './Skolepenger/VedtakOgBeregningSkolepenger';
import { VedtaksoppsummeringSkolepenger } from './Skolepenger/VedtaksoppsummeringSkolepenger';
import { NullstillVedtakModal } from './Felles/NullstillVedtakModal';
import { NullstillVedtakModalContext } from './Felles/NullstillVedtakModalContext';
import { AlertError } from '../../../Felles/Visningskomponenter/Alerts';
import { SmallTextLabel } from '../../../Felles/Visningskomponenter/Tekster';

const Side = styled.main`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem 2rem;
`;

const AlertErrorLeft = styled(AlertError)`
    margin-left: 2rem;
    margin-top: 1rem;
`;

interface Props {
    behandling: Behandling;
}

export const VedtakOgBeregningSide: FC<Props> = ({ behandling }) => {
    const { vilkårState } = useBehandling();

    const [visNullstillVedtakModal, settVisNullstillVedtakModal] = useState(false);
    const { vilkår, hentVilkår } = vilkårState;

    useEffect(() => {
        hentVilkår(behandling.id);
        // eslint-disable-next-line
    }, [behandling.id]);

    return (
        <NullstillVedtakModalContext.Provider
            value={{ visNullstillVedtakModal, settVisNullstillVedtakModal }}
        >
            <DataViewer response={{ vilkår }}>
                {({ vilkår }) => {
                    switch (behandling.stønadstype) {
                        case Stønadstype.OVERGANGSSTØNAD:
                            return (
                                <VedtakOgBeregningSideOvergangsstønad
                                    behandling={behandling}
                                    vilkår={vilkår}
                                />
                            );
                        case Stønadstype.BARNETILSYN:
                            return (
                                <VedtakOgBeregningSideBarnetilsyn
                                    behandling={behandling}
                                    vilkår={vilkår}
                                />
                            );
                        case Stønadstype.SKOLEPENGER:
                            return (
                                <VedtakOgBeregningSideSkolepenger
                                    behandling={behandling}
                                    vilkår={vilkår}
                                />
                            );
                    }
                }}
            </DataViewer>
            <NullstillVedtakModal
                visModal={visNullstillVedtakModal}
                settVisModal={settVisNullstillVedtakModal}
                behandlingId={behandling.id}
            />
        </NullstillVedtakModalContext.Provider>
    );
};

const VedtakOgBeregningSideOvergangsstønad: React.FC<{
    behandling: Behandling;
    vilkår: IVilkår;
}> = ({ behandling, vilkår }) => {
    return (
        <Side>
            <VedtaksoppsummeringOvergangsstønad vilkår={vilkår} behandling={behandling} />
            {behandling.steg === Steg.VILKÅR ? (
                <AlertStripeIkkeFerdigBehandletVilkår />
            ) : (
                <VedtakOgBeregningOvergangsstønad behandling={behandling} vilkår={vilkår} />
            )}
        </Side>
    );
};

const VedtakOgBeregningSideBarnetilsyn: React.FC<{
    behandling: Behandling;
    vilkår: IVilkår;
}> = ({ behandling, vilkår }) => {
    return (
        <Side>
            <VedtaksoppsummeringBarnetilsyn vilkår={vilkår} behandling={behandling} />
            {behandling.steg === Steg.VILKÅR ? (
                <AlertStripeIkkeFerdigBehandletVilkår />
            ) : (
                <VedtakOgBeregningBarnetilsyn behandling={behandling} vilkår={vilkår} />
            )}
        </Side>
    );
};

const AlertStripeIkkeFerdigBehandletVilkår = (): JSX.Element => (
    <AlertErrorLeft inline>
        <SmallTextLabel>
            Vedtaksresultat kan ikke settes da et eller flere vilkår er ubehandlet.
        </SmallTextLabel>
    </AlertErrorLeft>
);

const VedtakOgBeregningSideSkolepenger: React.FC<{
    behandling: Behandling;
    vilkår: IVilkår;
}> = ({ behandling, vilkår }) => {
    return (
        <Side>
            <VedtaksoppsummeringSkolepenger vilkår={vilkår} behandling={behandling} />
            {behandling.steg === Steg.VILKÅR ? (
                <AlertStripeIkkeFerdigBehandletVilkår />
            ) : (
                <VedtakOgBeregningSkolepenger behandling={behandling} vilkår={vilkår} />
            )}
        </Side>
    );
};
