import React, { useMemo } from 'react';
import styled from 'styled-components';
import { AlertWarning } from '../../../Felles/Visningskomponenter/Alerts';
import { AxiosRequestConfig } from 'axios';
import { useDataHenter } from '../../../App/hooks/felles/useDataHenter';
import { IHistoriskPensjon } from '../../../App/typer/historiskpensjon';
import DataViewer from '../../../Felles/DataViewer/DataViewer';

const StyledWarningStripe = styled(AlertWarning)`
    width: 40rem;
    vertical-align: text-top;
`;

const Historiskpensjon: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const historiskPensjonConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/historiskpensjon/${fagsakPersonId}`,
        }),
        [fagsakPersonId]
    );

    const historiskPensjon = useDataHenter<IHistoriskPensjon, null>(historiskPensjonConfig);

    return (
        <DataViewer response={{ historiskPensjon }}>
            {({ historiskPensjon }) => {
                const harPensjondata = historiskPensjon.harPensjonsdata;
                return harPensjondata ? (
                    <StyledWarningStripe>
                        Bruker har saker før desember 2008 som kan sees i{' '}
                        <a href={historiskPensjon.webAppUrl}>PE PP - Historisk pensjon</a>
                    </StyledWarningStripe>
                ) : null;
            }}
        </DataViewer>
    );
};

export default Historiskpensjon;
