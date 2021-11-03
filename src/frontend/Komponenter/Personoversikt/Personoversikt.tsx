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
import Dokumenter from './Dokumenter';
import { FritekstBrevContext } from '../Behandling/Brev/BrevTyper';
import Inntektsoversikt from './Inntektsoversikt';

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
                <>
                    <VisittkortComponent data={personopplysninger} />
                    <Side className={'container'}>
                        <TabsPure
                            tabs={[
                                { label: 'Personopplysninger', aktiv: tabvalg === 0 },
                                { label: 'Behandlingsoversikt', aktiv: tabvalg === 1 },
                                { label: 'Vedtaksperioder', aktiv: tabvalg === 2 },
                                { label: 'Dokumentoversikt', aktiv: tabvalg === 3 },
                                { label: 'Brev', aktiv: tabvalg === 4 },
                                { label: 'Inntekt', aktiv: tabvalg === 5 },
                            ]}
                            onChange={(_, tabNumber) => settTabvalg(tabNumber)}
                        />
                        {tabvalg === 0 && (
                            <Personopplysninger
                                personopplysninger={personopplysninger}
                                fagsakId={fagsakId}
                            />
                        )}
                        {tabvalg === 1 && <Behandlingsoversikt fagsakId={fagsakId} />}
                        {tabvalg === 2 && <Vedtaksperioder fagsakId={fagsakId} />}
                        {tabvalg === 3 && <Dokumenter personopplysninger={personopplysninger} />}
                        {tabvalg === 4 && (
                            <FritekstBrevMedVisning
                                fagsakId={fagsakId}
                                context={FritekstBrevContext.FRITTSTÅENDE}
                            />
                        )}
                        {tabvalg === 5 && <Inntektsoversikt fagsakId={fagsakId} />}
                    </Side>
                </>
            )}
        </DataViewer>
    );
};

export default Personoversikt;
