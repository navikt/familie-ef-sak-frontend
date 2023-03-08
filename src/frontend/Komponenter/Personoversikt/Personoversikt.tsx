import React, { useEffect, useMemo } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import PersonHeaderComponent from '../../Felles/PersonHeader/PersonHeader';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { Side } from '../../Felles/Visningskomponenter/Side';
import Behandlingsoversikt from './Behandlingsoversikt';
import Personopplysninger from './Personopplysninger';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import { AxiosRequestConfig } from 'axios';
import Vedtaksperioderoversikt from './Vedtaksperioderoversikt';
import FrittståendeBrevMedVisning from '../Behandling/Brev/FrittståendeBrevMedVisning';
import Dokumenter from './Dokumenter';
import { Infotrygdperioderoversikt } from './Infotrygdperioderoversikt';
import { IFagsakPerson } from '../../App/typer/fagsak';
import { useApp } from '../../App/context/AppContext';
import { useSetValgtFagsakPersonId } from '../../App/hooks/useSetValgtFagsakPersonId';
import { useSetPersonIdent } from '../../App/hooks/useSetPersonIdent';
import { useHentFagsakPerson } from '../../App/hooks/useHentFagsakPerson';
import { Tabs } from '@navikt/ds-react';
import { InntektForPerson } from './InntektForPerson';
import { ToggleName } from '../../App/context/toggles';
import { useToggles } from '../../App/context/TogglesContext';

type TabWithRouter = {
    label: string;
    path: string;
    komponent: (
        fagsakPerson: IFagsakPerson,
        personopplysninger: IPersonopplysninger,
        erSaksbehandler: boolean
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
        komponent: (fagsakPerson) => <Dokumenter fagsakPerson={fagsakPerson} />,
    },
    {
        label: 'Brev',
        path: 'frittstaaende-brev',
        komponent: (fagsakPerson, personopplysninger, erSaksbehandler) => {
            const fagsakId =
                fagsakPerson.overgangsstønad ||
                fagsakPerson.barnetilsyn ||
                fagsakPerson.skolepenger;

            return (
                erSaksbehandler &&
                fagsakId && (
                    <FrittståendeBrevMedVisning
                        fagsakId={fagsakId}
                        personopplysninger={personopplysninger}
                    />
                )
            );
        },
    },
    {
        label: 'Inntekt',
        path: 'inntekt',
        komponent: (fagsakPerson) => {
            return <InntektForPerson fagsakPerson={fagsakPerson} />;
        },
    },
];

const PersonoversiktContent: React.FC<{
    fagsakPerson: IFagsakPerson;
    personopplysninger: IPersonopplysninger;
}> = ({ fagsakPerson, personopplysninger }) => {
    const navigate = useNavigate();
    const { erSaksbehandler } = useApp();
    const { toggles } = useToggles();
    const paths = useLocation().pathname.split('/').slice(-1);
    const path = paths.length ? paths[paths.length - 1] : '';
    useSetPersonIdent(personopplysninger.personIdent);
    const skalInntektVises = toggles[ToggleName.visInntektPersonoversikt];
    if (skalInntektVises) {
        tabs.push({
            label: 'Inntekt',
            path: 'inntekt',
            komponent: (fagsakPerson) => {
                return <InntektForPerson fagsakPerson={fagsakPerson} />;
            },
        });
    }

    return (
        <>
            <PersonHeaderComponent data={personopplysninger} />
            <Side className={'container'}>
                <Tabs
                    value={path}
                    onChange={(tabPath) => {
                        navigate(tabPath);
                    }}
                >
                    <Tabs.List>
                        {tabs.map((tab) => {
                            return <Tabs.Tab key={tab.path} value={tab.path} label={tab.label} />;
                        })}
                    </Tabs.List>
                </Tabs>

                <Routes>
                    {tabs.map((tab) => (
                        <Route
                            key={tab.path}
                            path={`/${tab.path}`}
                            element={tab.komponent(
                                fagsakPerson,
                                personopplysninger,
                                erSaksbehandler
                            )}
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
    useSetValgtFagsakPersonId(fagsakPersonId);

    const { hentFagsakPerson, fagsakPerson } = useHentFagsakPerson();

    const personopplysningerConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/personopplysninger/fagsak-person/${fagsakPersonId}`,
        }),
        [fagsakPersonId]
    );

    useEffect(() => {
        hentFagsakPerson(fagsakPersonId);
    }, [hentFagsakPerson, fagsakPersonId]);

    useEffect(() => {
        document.title = 'Brukeroversikt';
    }, []);

    const personopplysninger = useDataHenter<IPersonopplysninger, null>(personopplysningerConfig);

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
