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
import { EBehandlingResultat } from '../../../App/typer/vedtak';

const Fane = styled.main`
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

export const VedtakOgBeregningFane: FC<Props> = ({ behandling }) => {
    const { vilkårState } = useBehandling();

    const [visNullstillVedtakModal, settVisNullstillVedtakModal] = useState(false);
    const { vilkår, hentVilkår } = vilkårState;
    const { vedtaksresultat } = useBehandling();

    const [resultatType, settResultatType] = useState<EBehandlingResultat | undefined>(
        vedtaksresultat
    );

    useEffect(() => {
        hentVilkår(behandling.id);
    }, [hentVilkår, behandling.id]);

    return (
        <NullstillVedtakModalContext.Provider
            value={{ visNullstillVedtakModal, settVisNullstillVedtakModal }}
        >
            <DataViewer response={{ vilkår }}>
                {({ vilkår }) => {
                    switch (behandling.stønadstype) {
                        case Stønadstype.OVERGANGSSTØNAD:
                            return (
                                <FaneOvergangsstønad
                                    behandling={behandling}
                                    vilkår={vilkår}
                                    resultatType={resultatType}
                                    settResultatType={settResultatType}
                                />
                            );
                        case Stønadstype.BARNETILSYN:
                            return (
                                <FaneBarnetilsyn
                                    behandling={behandling}
                                    vilkår={vilkår}
                                    resultatType={resultatType}
                                    settResultatType={settResultatType}
                                />
                            );
                        case Stønadstype.SKOLEPENGER:
                            return (
                                <FaneSkolepenger
                                    behandling={behandling}
                                    vilkår={vilkår}
                                    resultatType={resultatType}
                                    settResultatType={settResultatType}
                                />
                            );
                    }
                }}
            </DataViewer>
            <NullstillVedtakModal
                visModal={visNullstillVedtakModal}
                settVisModal={settVisNullstillVedtakModal}
                behandlingId={behandling.id}
                nullstillResultatType={() => settResultatType(undefined)}
            />
        </NullstillVedtakModalContext.Provider>
    );
};

export interface VedtakOgBeregningProps {
    behandling: Behandling;
    vilkår: IVilkår;
    resultatType: EBehandlingResultat | undefined;
    settResultatType: (resultat: EBehandlingResultat | undefined) => void;
}

const FaneOvergangsstønad: React.FC<VedtakOgBeregningProps> = ({
    behandling,
    vilkår,
    resultatType,
    settResultatType,
}) => (
    <Fane>
        <VedtaksoppsummeringOvergangsstønad vilkår={vilkår} behandling={behandling} />
        {behandling.steg === Steg.VILKÅR ? (
            <AlertStripe />
        ) : (
            <VedtakOgBeregningOvergangsstønad
                behandling={behandling}
                vilkår={vilkår}
                resultatType={resultatType}
                settResultatType={settResultatType}
            />
        )}
    </Fane>
);

const FaneBarnetilsyn: React.FC<VedtakOgBeregningProps> = ({
    behandling,
    vilkår,
    resultatType,
    settResultatType,
}) => (
    <Fane>
        <VedtaksoppsummeringBarnetilsyn vilkår={vilkår} behandling={behandling} />
        {behandling.steg === Steg.VILKÅR ? (
            <AlertStripe />
        ) : (
            <VedtakOgBeregningBarnetilsyn
                behandling={behandling}
                vilkår={vilkår}
                resultatType={resultatType}
                settResultatType={settResultatType}
            />
        )}
    </Fane>
);

const FaneSkolepenger: React.FC<VedtakOgBeregningProps> = ({
    behandling,
    vilkår,
    resultatType,
    settResultatType,
}) => (
    <Fane>
        <VedtaksoppsummeringSkolepenger vilkår={vilkår} behandling={behandling} />
        {behandling.steg === Steg.VILKÅR ? (
            <AlertStripe />
        ) : (
            <VedtakOgBeregningSkolepenger
                behandling={behandling}
                vilkår={vilkår}
                resultatType={resultatType}
                settResultatType={settResultatType}
            />
        )}
    </Fane>
);

const AlertStripe = () => (
    <AlertErrorLeft inline>
        <SmallTextLabel>
            Vedtaksresultat kan ikke settes da et eller flere vilkår er ubehandlet.
        </SmallTextLabel>
    </AlertErrorLeft>
);
