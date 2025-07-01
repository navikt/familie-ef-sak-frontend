import React, { useEffect, useMemo } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import { AxiosRequestConfig } from 'axios';
import { Infotrygdperioderoversikt } from './Infotrygdperioderoversikt';
import { FagsakPerson } from '../../App/typer/fagsak';
import { useApp } from '../../App/context/AppContext';
import { useSetValgtFagsakPersonId } from '../../App/hooks/useSetValgtFagsakPersonId';
import { useSetPersonIdent } from '../../App/hooks/useSetPersonIdent';
import { useHentFagsakPerson } from '../../App/hooks/useHentFagsakPerson';
import { Tabs } from '@navikt/ds-react';
import { InntektForPerson } from './InntektForPerson';
import { loggNavigereTabEvent } from '../../App/utils/amplitude/amplitudeLoggEvents';
import { PersonHeader } from '../../Felles/PersonHeader/PersonHeader';
import { Personopplysninger } from './Personopplysninger';
import { Vedtaksperioderoversikt } from './Vedtaksperioderoversikt';
import { Behandlingsoversikt } from './Behandlingsoversikt';
import { FrittståendeBrevMedVisning } from '../Behandling/Brev/FrittståendeBrevMedVisning';
import { Dokumenter } from './Dokumenter';
import { OpprettFagsak } from '../Behandling/Førstegangsbehandling/OpprettFagsak';
import { Side } from './Side';

interface FaneProps {
    label: string;
    path: string;
    komponent: (
        fagsakPerson: FagsakPerson,
        personopplysninger: IPersonopplysninger,
        erSaksbehandler: boolean,
        hentFagsakPerson: (fagsakPersonId: string) => void
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
        komponent: (fagsakPerson, personopplysninger, erSaksbehandler, hentFagsakPerson) => {
            const fagsakId =
                fagsakPerson.overgangsstønad?.id ||
                fagsakPerson.barnetilsyn?.id ||
                fagsakPerson.skolepenger?.id;

            if (!erSaksbehandler) {
                return <></>;
            }

            if (!fagsakId) {
                return (
                    <OpprettFagsak
                        fagsakPersonId={fagsakPerson.id}
                        hentFagsakPerson={hentFagsakPerson}
                        personIdent={personopplysninger.personIdent}
                    />
                );
            }

            return (
                <FrittståendeBrevMedVisning
                    fagsakId={fagsakId}
                    personopplysninger={personopplysninger}
                />
            );
        },
    },
    {
        label: 'Inntekt',
        path: 'inntekt',
        komponent: (fagsakPerson) => <InntektForPerson fagsakPersonId={fagsakPerson.id} />,
    },
];

export const PersonOversiktSide: React.FC = () => {
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
                <PersonOversikt
                    fagsakPersonId={fagsakPersonId}
                    fagsakPerson={fagsakPerson}
                    hentFagsakPerson={hentFagsakPerson}
                    personopplysninger={personopplysninger}
                />
            )}
        </DataViewer>
    );
};

interface Props {
    fagsakPersonId: string;
    fagsakPerson: FagsakPerson;
    hentFagsakPerson: (fagsakPersonId: string) => void;
    personopplysninger: IPersonopplysninger;
}

const PersonOversikt: React.FC<Props> = ({
    fagsakPersonId,
    fagsakPerson,
    hentFagsakPerson,
    personopplysninger,
}) => {
    const navigate = useNavigate();
    const { erSaksbehandler } = useApp();
    const paths = useLocation().pathname.split('/').slice(-1);
    const path = paths.length ? paths[paths.length - 1] : '';
    useSetPersonIdent(personopplysninger.personIdent);

    const skalHaBakgrunnsfarge = path === 'frittstaaende-brev';

    return (
        <>
            <PersonHeader fagsakPerson={fagsakPerson} personopplysninger={personopplysninger} />

            <Tabs
                value={path}
                onChange={(fane) => {
                    navigate(`/person/${fagsakPersonId}/${fane}`);
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
            <Side skalHaBakgrunnsfarge={skalHaBakgrunnsfarge}>
                <Routes>
                    {faner.map((fane) => (
                        <Route
                            key={fane.path}
                            path={`/${fane.path}`}
                            element={fane.komponent(
                                fagsakPerson,
                                personopplysninger,
                                erSaksbehandler,
                                hentFagsakPerson
                            )}
                        />
                    ))}
                    <Route
                        path="*"
                        element={
                            <Navigate
                                to={`/person/${fagsakPersonId}/behandlinger`}
                                replace={true}
                            />
                        }
                    />
                </Routes>
            </Side>
        </>
    );
};
