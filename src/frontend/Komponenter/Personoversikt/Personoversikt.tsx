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
import { IFagsakPerson } from '../../App/typer/fagsak';

const PersonoversiktContent: React.FC<{
    fagsakPerson: IFagsakPerson;
    personopplysninger: IPersonopplysninger;
}> = ({ fagsakPerson, personopplysninger }) => {
    const [tabvalg, settTabvalg] = useState<number>(1);
    const { id: fagsakPersonId } = fagsakPerson;

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
                        fagsakPersonId={fagsakPersonId}
                    />
                )}
                {/* TODO: Behandlingsoversikt trenger håndtering for å rendere behandlinger til ulike fagsaker  */}
                {tabvalg === 1 && <Behandlingsoversikt fagsakPerson={fagsakPerson} />}
                {/* TODO: Vedtaksperioderoversikt trenger håndtering for å rendere behandlinger til ulike fagsaker  */}
                {tabvalg === 2 && fagsakPerson.overgangsstønad && (
                    <Vedtaksperioderoversikt fagsakId={fagsakPerson.overgangsstønad} />
                )}
                {tabvalg === 3 && (
                    <Infotrygdperioderoversikt
                        fagsakPerson={fagsakPerson}
                        personIdent={personopplysninger.personIdent}
                    />
                )}
                {tabvalg === 4 && <Dokumenter personopplysninger={personopplysninger} />}
                {/* TODO: FrittståendeBrevMedVisning trenger håndtering for hver fagsak  */}
                {tabvalg === 5 && fagsakPerson.overgangsstønad && (
                    <FrittståendeBrevMedVisning fagsakId={fagsakPerson.overgangsstønad} />
                )}
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
