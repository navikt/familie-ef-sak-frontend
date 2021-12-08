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
import FrittståendeBrevMedVisning from '../Behandling/Brev/FrittståendeBrevMedVisning';
import Dokumenter from './Dokumenter';
import { useSetValgtPersonIdent } from '../../App/hooks/useSetValgtPersonIdent';

const PersonoversiktContent: React.FC<{
    fagsakId: string;
    personopplysninger: IPersonopplysninger;
}> = ({ fagsakId, personopplysninger }) => {
    const [tabvalg, settTabvalg] = useState<number>(1);
    useSetValgtPersonIdent(personopplysninger);

    return (
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
                {tabvalg === 4 && <FrittståendeBrevMedVisning fagsakId={fagsakId} />}
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
