import React, { FC } from 'react';
import { Alert } from '@navikt/ds-react';
import styled from 'styled-components';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { erEtterDagensDato } from '../../App/utils/dato';
import { IUtestengelse } from '../../App/typer/utestengelse';
import { Ressurs } from '../../App/typer/ressurs';

const AdvarselVisning = styled(Alert)`
    margin-top: 0.5rem;
`;

export const InfotripeUtestengelse: FC<{ utestengelser: Ressurs<IUtestengelse[]> }> = ({
    utestengelser,
}) => {
    return (
        <DataViewer response={{ utestengelser }}>
            {({ utestengelser }) => {
                const harGjeldendeUtestengelse = utestengelser.some((utestengelse) =>
                    erEtterDagensDato(utestengelse.periode.tom)
                );
                if (!utestengelser.length || !harGjeldendeUtestengelse) {
                    return null;
                }
                return (
                    <AdvarselVisning variant={'warning'} size={'small'}>
                        Bruker har utestengelse.
                    </AdvarselVisning>
                );
            }}
        </DataViewer>
    );
};
