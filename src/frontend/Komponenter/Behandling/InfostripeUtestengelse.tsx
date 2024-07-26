import React, { FC } from 'react';
import { Alert } from '@navikt/ds-react';
import styled from 'styled-components';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { formaterIsoDato, formaterIsoSisteDagIMåneden } from '../../App/utils/formatter';
import { useBehandling } from '../../App/context/BehandlingContext';

const AdvarselVisning = styled(Alert)`
    margin: 0.5rem 0.5rem 0 0.5rem;
    ul {
        margin: 0;
    }
`;

export const InfostripeUtestengelse: FC = () => {
    const { utestengelser } = useBehandling();
    return (
        <DataViewer response={{ utestengelser }}>
            {({ utestengelser }) => {
                if (!utestengelser.length) {
                    return null;
                }
                return (
                    <AdvarselVisning variant={'warning'} size={'small'}>
                        Bruker har vedtak om utestengelse i periodene:
                        <ul>
                            {utestengelser.map((utestengelse) => (
                                <li key={utestengelse.id}>
                                    {formaterIsoDato(utestengelse.periode.fom)} -{' '}
                                    {formaterIsoSisteDagIMåneden(utestengelse.periode.tom)}
                                </li>
                            ))}
                        </ul>
                    </AdvarselVisning>
                );
            }}
        </DataViewer>
    );
};
