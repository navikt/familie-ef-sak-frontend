import React, { useState } from 'react';
import styled from 'styled-components';
import { Normaltekst } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';
import { Collapse, Expand } from '@navikt/ds-icons';
import { Alert, Button } from '@navikt/ds-react';
import LenkeKnapp from '../../../../Felles/Knapper/LenkeKnapp';

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

export const ForrigeBehandlingBoks: React.FC = () => {
    const [visForrigeBehandling, settVisForrigeBehandling] = useState<boolean>(false);

    return (
        <Alertstripe variant={'info'} fullWidth={false}>
            <InfoHeader>
                <LenkeKnapp
                    onClick={() => {
                        settVisForrigeBehandling((prevState) => !prevState);
                    }}
                    minWidth={'16px'}
                >
                    <Normaltekst>
                        Gjenbruk vurdering av inngangsvilkår fra forrige behandling?
                    </Normaltekst>
                </LenkeKnapp>
                <LenkeKnapp
                    onClick={() => {
                        settVisForrigeBehandling((prevState) => !prevState);
                    }}
                    minWidth={'16px'}
                >
                    <LenkeIkon>{visForrigeBehandling ? <Collapse /> : <Expand />}</LenkeIkon>
                </LenkeKnapp>
            </InfoHeader>
            {visForrigeBehandling && (
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
                            <tr>
                                <td>Barnetilsyn</td>
                                <td>Førstegangsbehandling</td>
                                <td>01.04.2022</td>
                                <td>Innvilget</td>
                            </tr>
                        </tbody>
                    </ForrigeBehandlingTabell>
                    <Gjenbruksknapp variant="primary" size="small">
                        Gjenbruk vilkårsvurdering
                    </Gjenbruksknapp>
                </>
            )}
        </Alertstripe>
    );
};
