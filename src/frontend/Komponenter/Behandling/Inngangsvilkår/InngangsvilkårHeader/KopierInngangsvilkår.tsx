import React, { useState } from 'react';
import styled from 'styled-components';
import { Normaltekst } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';
import { Collapse, Expand } from '@navikt/ds-icons';
import { Alert, Button } from '@navikt/ds-react';
import LenkeKnapp from '../../../../Felles/Knapper/LenkeKnapp';
import { Behandling, behandlingResultatTilTekst } from '../../../../App/typer/fagsak';
import { behandlingstypeTilTekst } from '../../../../App/typer/behandlingstype';
import { formaterIsoDato } from '../../../../App/utils/formatter';
import { stønadstypeTilTekst } from '../../../../App/typer/behandlingstema';
import KopierInngangsvilkårModal from './KopierInngangsvilkårModal';

const Alertstripe = styled(Alert)`
    margin-top: 1rem;
    margin-right: 2rem;
    margin-left: 2rem;
    margin-bottom: 1rem;
    width: 40rem;
`;

const InfoHeader = styled.div`
    display: grid;
    grid-template-columns: 26rem 2rem;
`;

const LenkeIkon = styled.div`
    top: 2px;
    display: inline-block;
    position: relative;
`;

const ForrigeBehandlingTabell = styled.table`
    margin-top: 1rem;
    margin-bottom: 1rem;
    width: 100%;
    border-collapse: collapse;
    font-size: 1rem;

    td,
    th {
        border-bottom: 1px solid ${navFarger.navGra40};
        padding: 0rem 2rem 0rem 0rem;
        text-align: left;
    }
`;

const Gjenbruksknapp = styled(Button)`
    display: block;
    margin-left: auto;
    margin-right: auto;
`;

interface Props {
    behandlinger: Behandling[];
    behandlingId: string;
    gjenbrukInngangsvilkår: (behandlingId: string, kopierBehandlingId: string) => void;
}

export const KopierInngangsvilkår: React.FC<Props> = ({
    behandlinger,
    behandlingId,
    gjenbrukInngangsvilkår,
}) => {
    const [visForrigeBehandlinger, settVisForrigeBehandlinger] = useState<boolean>(false);
    const [visModal, settVisModal] = useState<boolean>(false);
    const forrigeBehandling = behandlinger.slice(0, 1); // Dersom vi ønsker at bruker skal kunne velge mellom flere tidligere behandlinger kan denne linjen fjernes

    return (
        <Alertstripe variant={'info'} fullWidth={false}>
            <InfoHeader>
                <LenkeKnapp
                    onClick={() => {
                        settVisForrigeBehandlinger((prevState) => !prevState);
                    }}
                    minWidth={'16px'}
                >
                    <Normaltekst>
                        Gjenbruk vurdering av inngangsvilkår fra forrige behandling?
                    </Normaltekst>
                </LenkeKnapp>
                <LenkeKnapp
                    onClick={() => {
                        settVisForrigeBehandlinger((prevState) => !prevState);
                    }}
                    minWidth={'16px'}
                >
                    <LenkeIkon>{visForrigeBehandlinger ? <Collapse /> : <Expand />}</LenkeIkon>
                </LenkeKnapp>
            </InfoHeader>
            {visForrigeBehandlinger && (
                <>
                    <ForrigeBehandlingTabell>
                        <thead>
                            <tr>
                                <th>
                                    <b>Stønadstype</b>
                                </th>
                                <th>
                                    <b>Behandlingstype</b>
                                </th>
                                <th>
                                    <b>Vedtaksdato</b>
                                </th>
                                <th>
                                    <b>Vedtaksresultat</b>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {forrigeBehandling.map((behandling) => {
                                return (
                                    <tr key={behandling.id}>
                                        <td>{stønadstypeTilTekst[behandling.stønadstype]}</td>
                                        <td>{behandlingstypeTilTekst[behandling.type]}</td>
                                        <td>
                                            {behandling.vedtaksdato &&
                                                formaterIsoDato(behandling.vedtaksdato)}
                                        </td>
                                        <td>{behandlingResultatTilTekst[behandling.resultat]}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </ForrigeBehandlingTabell>
                    <Gjenbruksknapp
                        variant="primary"
                        size="small"
                        onClick={() => settVisModal(true)}
                    >
                        Gjenbruk vilkårsvurdering
                    </Gjenbruksknapp>
                    <KopierInngangsvilkårModal
                        visModal={visModal}
                        settVisModal={settVisModal}
                        behandlingId={behandlingId}
                        kopierBehandlingId={forrigeBehandling[0].id}
                        gjenbrukInngangsvilkår={gjenbrukInngangsvilkår}
                    />
                </>
            )}
        </Alertstripe>
    );
};
