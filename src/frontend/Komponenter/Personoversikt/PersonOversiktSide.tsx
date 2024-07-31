import React, { useEffect, useMemo } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import { AxiosRequestConfig } from 'axios';
import { Infotrygdperioderoversikt } from './Infotrygdperioderoversikt';
import { FagsakPersonMedBehandlinger } from '../../App/typer/fagsak';
import { useApp } from '../../App/context/AppContext';
import { useSetValgtFagsakPersonId } from '../../App/hooks/useSetValgtFagsakPersonId';
import { useSetPersonIdent } from '../../App/hooks/useSetPersonIdent';
import { useHentFagsakPersonUtvidet } from '../../App/hooks/useHentFagsakPerson';
import { Tabs } from '@navikt/ds-react';
import { InntektForPerson } from './InntektForPerson';
import { loggNavigereTabEvent } from '../../App/utils/amplitude/amplitudeLoggEvents';
import styled from 'styled-components';
import { PersonHeader } from '../../Felles/PersonHeader/PersonHeader';
import { Personopplysninger } from './Personopplysninger';
import { Vedtaksperioderoversikt } from './Vedtaksperioderoversikt';
import { Behandlingsoversikt } from './Behandlingsoversikt';
import { FrittståendeBrevMedVisning } from '../Behandling/Brev/FrittståendeBrevMedVisning';
import { Dokumenter } from './Dokumenter';

interface FaneProps {
    label: string;
    path: string;
    komponent: (
        fagsakPerson: FagsakPersonMedBehandlinger,
        personopplysninger: IPersonopplysninger,
        erSaksbehandler: boolean
    ) => React.ReactNode | undefined;
}

const faner: FaneProps[] = [
    {
        label: 'Personopplysninger',
        path: 'personopplysninger',
        komponent: (fagsakPerson, personopplysninger) => (
            <Personopplysninger
                personopplysninger={personopplysninger}
                fagsakPerson={fagsakPerson}
            />
        ),
    },
    {
        label: 'Behandlingsoversikt',
        path: 'behandlinger',
        komponent: (fagsakPerson) => <Behandlingsoversikt fagsakPerson={fagsakPerson} />,
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
                fagsakPersonId={fagsakPerson.id}
                personIdent={personopplysninger.personIdent}
            />
        ),
    },
    {
        label: 'Dokumentoversikt',
        path: 'dokumenter',
        komponent: (fagsakPerson) => <Dokumenter fagsakPersonId={fagsakPerson.id} />,
    },
    {
        label: 'Brev',
        path: 'frittstaaende-brev',
        komponent: (fagsakPerson, personopplysninger, erSaksbehandler) => {
            const fagsakId =
                fagsakPerson.overgangsstønad?.id ||
                fagsakPerson.barnetilsyn?.id ||
                fagsakPerson.skolepenger?.id;

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
        komponent: (fagsakPerson) => <InntektForPerson fagsakPersonId={fagsakPerson.id} />,
    },
];

const Container = styled.div`
    margin: 0.5rem;
`;

export const PersonOversiktSide: React.FC = () => {
    const fagsakPersonId = useParams<{ fagsakPersonId: string }>().fagsakPersonId as string;
    useSetValgtFagsakPersonId(fagsakPersonId);

    const { hentFagsakPerson, fagsakPerson } = useHentFagsakPersonUtvidet();

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
                <PersonOversikt
                    fagsakPerson={fagsakPerson}
                    personopplysninger={personopplysninger}
                />
            )}
        </DataViewer>
    );
};

interface Props {
    fagsakPerson: FagsakPersonMedBehandlinger;
    personopplysninger: IPersonopplysninger;
}

const PersonOversikt: React.FC<Props> = ({ fagsakPerson, personopplysninger }) => {
    const navigate = useNavigate();
    const { erSaksbehandler } = useApp();
    const paths = useLocation().pathname.split('/').slice(-1);
    const path = paths.length ? paths[paths.length - 1] : '';
    useSetPersonIdent(personopplysninger.personIdent);

    return (
        <>
            <PersonHeader fagsakPerson={fagsakPerson} personopplysninger={personopplysninger} />
            <Container>
                <Tabs
                    value={path}
                    onChange={(fane) => {
                        navigate(fane);
                        loggNavigereTabEvent({
                            side: 'person',
                            forrigeFane: path,
                            nesteFane: fane,
                        });
                    }}
                >
                    <Tabs.List>
                        {faner.map((fane) => (
                            <Tabs.Tab key={fane.path} value={fane.path} label={fane.label} />
                        ))}
                    </Tabs.List>
                </Tabs>
                <Routes>
                    {faner.map((fane) => (
                        <Route
                            key={fane.path}
                            path={`/${fane.path}`}
                            element={fane.komponent(
                                fagsakPerson,
                                personopplysninger,
                                erSaksbehandler
                            )}
                        />
                    ))}
                    <Route path="*" element={<Navigate to="behandlinger" replace={true} />} />
                </Routes>
            </Container>
        </>
    );
};
