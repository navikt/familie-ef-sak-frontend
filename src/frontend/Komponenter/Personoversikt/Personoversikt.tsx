import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import VisittkortComponent from '../../Felles/Visittkort/Visittkort';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { Side } from '../../Felles/Visningskomponenter/Side';
import Behandlingsoversikt from './Behandlingsoversikt';
import { TabsPure } from 'nav-frontend-tabs';
import Personopplysninger from './Personopplysninger';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import { AxiosRequestConfig } from 'axios';
import Vedtaksperioder from './Vedtaksperioder';
import FritekstBrevMedVisning from '../Behandling/Brev/FritekstBrevMedVisning';

const Personoversikt: React.FC = () => {
    const { fagsakId } = useParams<{ fagsakId: string }>();
    const [tabvalg, settTabvalg] = useState<number>(1);

    const personopplysningerConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/personopplysninger/fagsak/${fagsakId}`,
        }),
        [fagsakId]
    );

    const personopplysninger = useDataHenter<IPersonopplysninger, null>(personopplysningerConfig);

    return (
        <DataViewer response={{ personopplysninger }}>
            {({ personopplysninger }) => (
                <Side className={'container'}>
                    <VisittkortComponent data={personopplysninger} />
                    <TabsPure
                        tabs={[
                            { label: 'Personopplysninger', aktiv: tabvalg === 0 },
                            { label: 'Behandlingsoversikt', aktiv: tabvalg === 1 },
                            { label: 'Vedtaksperioder', aktiv: tabvalg === 2 },
                            { label: 'Dokumentoversikt', disabled: true },
                            { label: 'Brev', aktiv: tabvalg === 4 },
                        ]}
                        onChange={(_, tabNumber) => tabNumber !== 3 && settTabvalg(tabNumber)}
                    />
                    {tabvalg === 0 && (
                        <Personopplysninger personopplysninger={personopplysninger} />
                    )}
                    {tabvalg === 1 && <Behandlingsoversikt fagsakId={fagsakId} />}
                    {tabvalg === 2 && <Vedtaksperioder fagsakId={fagsakId} />}
                    {tabvalg === 4 && <FritekstBrevMedVisning fagsakId={fagsakId} />}
                </Side>
            )}
        </DataViewer>
    );
};

export default Personoversikt;
