import React, { useEffect, useMemo } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { IPersonopplysninger } from '../../App/typer/personopplysninger';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import { AxiosRequestConfig } from 'axios';
import { FagsakPerson } from '../../App/typer/fagsak';
import { useApp } from '../../App/context/AppContext';
import { useSetValgtFagsakPersonId } from '../../App/hooks/useSetValgtFagsakPersonId';
import { useSetPersonIdent } from '../../App/hooks/useSetPersonIdent';
import { useHentFagsakPerson } from '../../App/hooks/useHentFagsakPerson';
import { Tabs, VStack } from '@navikt/ds-react';
import { InntektForPerson } from './InntektForPerson';
import { PersonHeader } from '../../Felles/PersonHeader/PersonHeader';
import { Personopplysninger } from './Personopplysninger';
import { Vedtaksperioderoversikt } from './Vedtaksperioderoversikt';
import { Behandlingsoversikt } from './Behandlingsoversikt';
import { FrittståendeBrevMedVisning } from '../Behandling/Brev/FrittståendeBrevMedVisning';
import { Dokumenter } from './Dokumenter';
import { OpprettFagsak } from '../Behandling/Førstegangsbehandling/OpprettFagsak';
import { ABgSubtle, ABgDefault } from '@navikt/ds-tokens/dist/tokens';
import { AndreYtelserFane } from './AndreYtelser/AndreYtelserFane';
import { useToggles } from '../../App/context/TogglesContext';
import { ToggleName } from '../../App/context/toggles';
import { Sticky } from '../../Felles/Visningskomponenter/Sticky';

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
        komponent: (fagsakPerson, personopplysninger) => (
            <Vedtaksperioderoversikt
                fagsakPerson={fagsakPerson}
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
    {
        label: 'Andre ytelser',
        path: 'andre-ytelser',
        komponent: (fagsakPerson) => <AndreYtelserFane fagsakPersonId={fagsakPerson.id} />,
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
    const { toggles } = useToggles();
    const paths = useLocation().pathname.split('/').slice(-1);
    const path = paths.length ? paths[paths.length - 1] : '';
    useSetPersonIdent(personopplysninger.personIdent);

    const bakgrunnsfarge = path === 'frittstaaende-brev' ? ABgSubtle : ABgDefault;

    const fanerMedFeatureToggle = faner.filter((fane) =>
        toggles[ToggleName.visAndreYtelser] ? true : fane.path !== 'andre-ytelser'
    );

    return (
        <>
            <Sticky
                style={{
                    zIndex: 23,
                    top: '48px', // Høyden på headeren
                }}
            >
                <VStack>
                    <PersonHeader
                        fagsakPerson={fagsakPerson}
                        personopplysninger={personopplysninger}
                    />

                    <Tabs
                        value={path}
                        onChange={(fane) => {
                            navigate(`/person/${fagsakPersonId}/${fane}`);
                        }}
                    >
                        <Tabs.List>
                            {fanerMedFeatureToggle.map((fane) => (
                                <Tabs.Tab key={fane.path} value={fane.path} label={fane.label} />
                            ))}
                        </Tabs.List>
                    </Tabs>
                </VStack>
            </Sticky>

            <div style={{ padding: '1rem', backgroundColor: bakgrunnsfarge }}>
                <Routes>
                    {fanerMedFeatureToggle.map((fane) => (
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
            </div>
        </>
    );
};
