import React, { useState } from 'react';
import styled from 'styled-components';
import { Normaltekst } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';
import { Collapse, Expand, ExternalLink } from '@navikt/ds-icons';
import { Alert, BodyLong, Button, Link } from '@navikt/ds-react';
import LenkeKnapp from '../../../../Felles/Knapper/LenkeKnapp';
import { Behandling, behandlingResultatTilTekst } from '../../../../App/typer/fagsak';
import { behandlingstypeTilTekst } from '../../../../App/typer/behandlingstype';
import { formaterIsoDato } from '../../../../App/utils/formatter';
import { stønadstypeTilTekst } from '../../../../App/typer/behandlingstema';
import { behandlingStatusTilTekst } from '../../../../App/typer/behandlingstatus';
import { ModalWrapper } from '../../../../Felles/Modal/ModalWrapper';

const Alertstripe = styled(Alert)`
    margin: 1rem 2rem 2rem 1rem;
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
        padding: 0rem 1.5rem 0rem 0rem;
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
                                    <b>Status</b>
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
                                        <td>
                                            <Link
                                                href={`/behandling/${behandling.id}/inngangsvilkar`}
                                                target={'_blank'}
                                            >
                                                {behandlingstypeTilTekst[behandling.type]}
                                                <ExternalLink />
                                            </Link>
                                        </td>
                                        <td>{behandlingStatusTilTekst[behandling.status]}</td>
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
                    <ModalWrapper
                        tittel={'Gjenbruk av vilkårsvurderinger'}
                        visModal={visModal}
                        onClose={() => settVisModal(false)}
                        aksjonsknapper={{
                            hovedKnapp: {
                                onClick: () => {
                                    settVisModal(false);
                                    gjenbrukInngangsvilkår(behandlingId, forrigeBehandling[0].id);
                                },
                                tekst: 'Gjenbruk vilkårsvurdering',
                            },
                            lukkKnapp: {
                                onClick: () => settVisModal(false),
                                tekst: 'Avbryt',
                            },
                        }}
                    >
                        <BodyLong>
                            Er du sikker på at du vil gjenbruke vilkårsvurdering fra tidligere
                            behandling? Inngangsvilkår du allerede har vurdert i inneværende
                            behandling vil bli overskrevet.
                        </BodyLong>
                    </ModalWrapper>
                </>
            )}
        </Alertstripe>
    );
};
