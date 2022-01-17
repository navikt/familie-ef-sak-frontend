import React, { useEffect, useMemo, useState } from 'react';
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
import Vedtaksperioderoversikt from './Vedtaksperioderoversikt';
import FrittståendeBrevMedVisning from '../Behandling/Brev/FrittståendeBrevMedVisning';
import Dokumenter from './Dokumenter';
import Infotrygdperioderoversikt from './Infotrygdperioderoversikt';

const PersonoversiktContent: React.FC<{
    fagsakId: string;
    personopplysninger: IPersonopplysninger;
}> = ({ fagsakId, personopplysninger }) => {
    const [tabvalg, settTabvalg] = useState<number>(1);

    return (
        <>
            <VisittkortComponent data={personopplysninger} />
            <Side className={'container'}>
                <TabsPure
                    tabs={[
                        { label: 'Personopplysninger', aktiv: tabvalg === 0 },
                        { label: 'Behandlingsoversikt', aktiv: tabvalg === 1 },
                        { label: 'Vedtaksperioder', aktiv: tabvalg === 2 },
                        { label: 'Vedtaksperioder infotrygd', aktiv: tabvalg === 3 },
                        { label: 'Dokumentoversikt', aktiv: tabvalg === 4 },
                        { label: 'Brev', aktiv: tabvalg === 5 },
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
                {tabvalg === 2 && <Vedtaksperioderoversikt fagsakId={fagsakId} />}
                {tabvalg === 3 && (
                    <Infotrygdperioderoversikt
                        fagsakId={fagsakId}
                        personIdent={personopplysninger.personIdent}
                    />
                )}
                {tabvalg === 4 && <Dokumenter personopplysninger={personopplysninger} />}
                {tabvalg === 5 && <FrittståendeBrevMedVisning fagsakId={fagsakId} />}
            </Side>
        </>
    );
};

const Personoversikt: React.FC = () => {
    const { fagsakId } = useParams<{ fagsakId: string }>();

    const personopplysningerConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/personopplysninger/fagsak/${fagsakId}`,
        }),
        [fagsakId]
    );

    useEffect(() => {
        document.title = 'Brukeroversikt';
    }, []);

    const personopplysninger = useDataHenter<IPersonopplysninger, null>(personopplysningerConfig);

    return (
        <DataViewer response={{ personopplysninger }}>
            {({ personopplysninger }) => (
                <PersonoversiktContent
                    fagsakId={fagsakId}
                    personopplysninger={personopplysninger}
                />
            )}
        </DataViewer>
    );
};

export default Personoversikt;
