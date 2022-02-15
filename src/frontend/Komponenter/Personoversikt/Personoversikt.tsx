import React, { useEffect, useMemo } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
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
import { IFagsakPerson } from '../../App/typer/fagsak';

type TabWithRouter = {
    label: string;
    path: string;
    komponent: (
        fagsakPerson: IFagsakPerson,
        personopplysninger: IPersonopplysninger
    ) => React.ReactNode | undefined;
};

const tabs: TabWithRouter[] = [
    {
        label: 'Personopplysninger',
        path: 'personopplysninger',
        komponent: (fagsakPerson, personopplysninger) => (
            <Personopplysninger
                personopplysninger={personopplysninger}
                fagsakPersonId={fagsakPerson.id}
            />
        ),
    },
    {
        label: 'Behandlingsoversikt',
        path: 'behandlinger',
        komponent: (fagsakPerson) => <Behandlingsoversikt fagsakPersonId={fagsakPerson.id} />,
    },
    {
        label: 'Vedtaksperioder',
        path: 'vedtak',
        komponent: (fagsakPerson) => <Vedtaksperioderoversikt fagsakPerson={fagsakPerson} />,
    },
    {
        label: 'Vedtaksperioder infotrygd',
        path: 'infotrygd',
        komponent: (fagsakPerson, personopplysninger) => (
            <Infotrygdperioderoversikt
                fagsakPerson={fagsakPerson}
                personIdent={personopplysninger.personIdent}
            />
        ),
    },
    {
        label: 'Dokumentoversikt',
        path: 'dokumenter',
        komponent: (_, personopplysninger) => (
            <Dokumenter personopplysninger={personopplysninger} />
        ),
    },
    {
        label: 'Brev',
        path: 'frittstaaende-brev',
        komponent: (fagsakPerson) =>
            fagsakPerson.overgangsstønad && (
                <FrittståendeBrevMedVisning fagsakId={fagsakPerson.overgangsstønad} />
            ),
    },
];

const PersonoversiktContent: React.FC<{
    fagsakPerson: IFagsakPerson;
    personopplysninger: IPersonopplysninger;
}> = ({ fagsakPerson, personopplysninger }) => {
    const navigate = useNavigate();

    const paths = useLocation().pathname.split('/').slice(-1);
    const path = paths.length ? paths[paths.length - 1] : '';
    return (
        <>
            <VisittkortComponent data={personopplysninger} />
            <Side className={'container'}>
                <TabsPure
                    tabs={tabs.map((tab) => ({ label: tab.label, aktiv: tab.path === path }))}
                    onChange={(_, tabNumber) => {
                        navigate(tabs[tabNumber].path);
                    }}
                />

                <Routes>
                    {tabs.map((tab) => (
                        <Route
                            key={tab.path}
                            path={`/${tab.path}`}
                            element={tab.komponent(fagsakPerson, personopplysninger)}
                        />
                    ))}
                    <Route path="*" element={<Navigate to="behandlinger" replace={true} />} />
                </Routes>
            </Side>
        </>
    );
};

const Personoversikt: React.FC = () => {
    const fagsakPersonId = useParams<{ fagsakPersonId: string }>().fagsakPersonId as string;

    const personopplysningerConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/personopplysninger/fagsak-person/${fagsakPersonId}`,
        }),
        [fagsakPersonId]
    );

    const fagsakPersonConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/fagsak-person/${fagsakPersonId}`,
        }),
        [fagsakPersonId]
    );

    useEffect(() => {
        document.title = 'Brukeroversikt';
    }, []);

    const personopplysninger = useDataHenter<IPersonopplysninger, null>(personopplysningerConfig);
    const fagsakPerson = useDataHenter<IFagsakPerson, null>(fagsakPersonConfig);

    return (
        <DataViewer response={{ personopplysninger, fagsakPerson }}>
            {({ personopplysninger, fagsakPerson }) => (
                <PersonoversiktContent
                    fagsakPerson={fagsakPerson}
                    personopplysninger={personopplysninger}
                />
            )}
        </DataViewer>
    );
};

export default Personoversikt;
