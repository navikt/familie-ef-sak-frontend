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
import { TabProps } from 'nav-frontend-tabs/lib/tab';

type TabWithPathProp = TabProps & { path: string };

const tabs: TabWithPathProp[] = [
    { label: 'Personopplysninger', path: 'personopplysninger' },
    { label: 'Behandlingsoversikt', path: 'behandlinger' },
    { label: 'Vedtaksperioder', path: 'vedtak' },
    { label: 'Vedtaksperioder infotrygd', path: 'infotrygd' },
    { label: 'Dokumentoversikt', path: 'dokumenter' },
    { label: 'Brev', path: 'frittstaaende-brev' },
];

const PersonoversiktContent: React.FC<{
    fagsakPerson: IFagsakPerson;
    personopplysninger: IPersonopplysninger;
}> = ({ fagsakPerson, personopplysninger }) => {
    const navigate = useNavigate();
    const { id: fagsakPersonId } = fagsakPerson;

    const paths = useLocation().pathname.split('/').slice(-1);
    const path = paths.length ? paths[paths.length - 1] : '';
    return (
        <>
            <VisittkortComponent data={personopplysninger} />
            <Side className={'container'}>
                <TabsPure
                    tabs={tabs.map((tab) => ({ ...tab, aktiv: tab.path === path }))}
                    onChange={(_, tabNumber) => {
                        navigate(tabs[tabNumber].path);
                    }}
                />

                <Routes>
                    <Route
                        path="/personopplysninger"
                        element={
                            <Personopplysninger
                                personopplysninger={personopplysninger}
                                fagsakPersonId={fagsakPersonId}
                            />
                        }
                    />
                    {/* TODO: Behandlingsoversikt trenger håndtering for å rendere behandlinger til ulike fagsaker  */}
                    <Route
                        path="/behandlinger"
                        element={
                            fagsakPerson.overgangsstønad && (
                                <Behandlingsoversikt fagsakId={fagsakPerson.overgangsstønad} />
                            )
                        }
                    />
                    {/* TODO: Vedtaksperioderoversikt trenger håndtering for å rendere behandlinger til ulike fagsaker  */}
                    <Route
                        path="/vedtak"
                        element={
                            fagsakPerson.overgangsstønad && (
                                <Vedtaksperioderoversikt fagsakId={fagsakPerson.overgangsstønad} />
                            )
                        }
                    />
                    <Route
                        path="/infotrygd"
                        element={
                            <Infotrygdperioderoversikt
                                fagsakPerson={fagsakPerson}
                                personIdent={personopplysninger.personIdent}
                            />
                        }
                    />
                    <Route
                        path="/dokumenter"
                        element={<Dokumenter personopplysninger={personopplysninger} />}
                    />
                    {/* TODO: FrittståendeBrevMedVisning trenger håndtering for hver fagsak  */}
                    <Route
                        path="/frittstaaende-brev"
                        element={
                            fagsakPerson.overgangsstønad && (
                                <FrittståendeBrevMedVisning
                                    fagsakId={fagsakPerson.overgangsstønad}
                                />
                            )
                        }
                    />
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
