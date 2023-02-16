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
import { NullstillVedtakModalContext } from './NullstillVedtakModalContext';
import { SaksinformasjonSkolepenger } from './Skolepenger/SaksinformasjonSkolepenger';
import { AlertError } from '../../../Felles/Visningskomponenter/Alerts';
import { SmallTextLabel } from '../../../Felles/Visningskomponenter/Tekster';
import { RessursStatus } from '../../../App/typer/ressurs';

const AlertErrorLeft = styled(AlertError)`
    margin-left: 2rem;
    margin-top: 1rem;
`;

const AlertStripeIkkeFerdigBehandletVilkår = (): JSX.Element => (
    <AlertErrorLeft inline>
        <SmallTextLabel>
            Vedtaksresultat kan ikke settes da et eller flere vilkår er ubehandlet.
        </SmallTextLabel>
    </AlertErrorLeft>
);

export const VedtakOgBeregningSide: FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { behandling, useHentVilkår } = useBehandling();

    const [visNullstillVedtakModal, settVisNullstillVedtakModal] = useState(false);
    const { vilkår, hentVilkår } = useHentVilkår;

    useEffect(() => {
        if (vilkår.status === RessursStatus.IKKE_HENTET) {
            hentVilkår(behandlingId);
        }
        // eslint-disable-next-line
    }, [behandlingId]);

    return (
        <NullstillVedtakModalContext.Provider
            value={{ visNullstillVedtakModal, settVisNullstillVedtakModal }}
        >
            <DataViewer response={{ behandling, vilkår }}>
                {({ behandling, vilkår }) => {
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
                behandlingId={behandlingId}
            />
        </NullstillVedtakModalContext.Provider>
    );
};

const VedtakOgBeregningSideOvergangsstønad: React.FC<{
    behandling: Behandling;
    vilkår: IVilkår;
}> = ({ behandling, vilkår }) => {
    return (
        <>
            <VedtaksoppsummeringOvergangsstønad vilkår={vilkår} behandling={behandling} />
            {behandling.steg === Steg.VILKÅR ? (
                <AlertStripeIkkeFerdigBehandletVilkår />
            ) : (
                <VedtakOgBeregningOvergangsstønad behandling={behandling} vilkår={vilkår} />
            )}
        </>
    );
};

const VedtakOgBeregningSideBarnetilsyn: React.FC<{
    behandling: Behandling;
    vilkår: IVilkår;
}> = ({ behandling, vilkår }) => {
    return (
        <>
            <VedtaksoppsummeringBarnetilsyn vilkår={vilkår} behandling={behandling} />
            {behandling.steg === Steg.VILKÅR ? (
                <AlertStripeIkkeFerdigBehandletVilkår />
            ) : (
                <VedtakOgBeregningBarnetilsyn behandling={behandling} vilkår={vilkår} />
            )}
        </>
    );
};

const VedtakOgBeregningSideSkolepenger: React.FC<{
    behandling: Behandling;
    vilkår: IVilkår;
}> = ({ behandling, vilkår }) => {
    return (
        <>
            <VedtaksoppsummeringSkolepenger vilkår={vilkår} behandling={behandling} />
            <SaksinformasjonSkolepenger vilkår={vilkår} behandling={behandling} />

            {behandling.steg === Steg.VILKÅR ? (
                <AlertStripeIkkeFerdigBehandletVilkår />
            ) : (
                <VedtakOgBeregningSkolepenger behandling={behandling} vilkår={vilkår} />
            )}
        </>
    );
};
