import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { IPersonopplysninger } from '../typer/personopplysninger';
import VisittkortComponent from '../Felleskomponenter/Visittkort/Visittkort';
import DataViewer from '../Felleskomponenter/DataViewer/DataViewer';
import { Side } from '../Felleskomponenter/Side/Side';
import Behandlingsoversikt from './Behandlingsoversikt';
import Tabs from 'nav-frontend-tabs';
import Personopplysninger from './Personopplysninger';
import { useDataHenter } from '../hooks/felles/useDataHenter';
import { AxiosRequestConfig } from 'axios';

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
                    <Tabs
                        defaultAktiv={tabvalg}
                        tabs={[
                            { label: 'Personopplysninger' },
                            { label: 'Behandlingsoversikt' },
                            { label: 'Vedtaksperioder', disabled: true },
                            { label: 'Dokumentoversikt', disabled: true },
                        ]}
                        onChange={(_, tabNumber) => settTabvalg(tabNumber)}
                    />
                    {tabvalg === 0 && (
                        <Personopplysninger personopplysninger={personopplysninger} />
                    )}
                    {tabvalg === 1 && (
                        <Behandlingsoversikt
                            fagsakId={fagsakId}
                            personIdent={personopplysninger.personIdent}
                        />
                    )}
                </Side>
            )}
        </DataViewer>
    );
};

export default Personoversikt;
