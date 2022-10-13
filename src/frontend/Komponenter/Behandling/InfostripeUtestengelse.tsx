import React, { FC } from 'react';
import { Alert } from '@navikt/ds-react';
import styled from 'styled-components';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { IUtestengelse } from '../../App/typer/utestengelse';
import { Ressurs } from '../../App/typer/ressurs';
import { formaterIsoDato } from '../../App/utils/formatter';

const AdvarselVisning = styled(Alert)`
    margin: 0.5rem 0.5rem 0 0.5rem;
    ul {
        margin: 0;
    }
`;

export const InfostripeUtestengelse: FC<{ utestengelser: Ressurs<IUtestengelse[]> }> = ({
    utestengelser,
}) => {
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
                                    {formaterIsoDato(utestengelse.periode.tom)}
                                </li>
                            ))}
                        </ul>
                    </AdvarselVisning>
                );
            }}
        </DataViewer>
    );
};
