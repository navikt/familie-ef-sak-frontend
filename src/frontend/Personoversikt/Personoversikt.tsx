import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { useApp } from '../context/AppContext';
import { IPersonopplysninger } from '../typer/personopplysninger';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';
import VisittkortComponent from '../Felleskomponenter/Visittkort/Visittkort';
import DataViewer from '../Felleskomponenter/DataViewer/DataViewer';
import { Side } from '../Felleskomponenter/Side/Side';
import Behandlingsoversikt from './Behandlingsoversikt';
import Tabs from 'nav-frontend-tabs';
import Personopplysninger from './Personopplysninger';

const Personoversikt: React.FC = () => {
    const { fagsakId } = useParams<{ fagsakId: string }>();
    const [tabvalg, settTabvalg] = useState<number>(1);
    const [personopplysninger, settPersonopplysninger] = useState<Ressurs<IPersonopplysninger>>(
        byggTomRessurs()
    );
    const { axiosRequest } = useApp();

    const hentPersonData = () =>
        axiosRequest<IPersonopplysninger, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/personopplysninger/fagsak/${fagsakId}`,
        }).then((response) => settPersonopplysninger(response));

    useEffect(() => {
        if (fagsakId) {
            hentPersonData();
        }
        // eslint-disable-next-line
    }, [fagsakId]);

    return (
        <DataViewer response={{ personOpplysninger: personopplysninger }}>
            {({ personOpplysninger }) => (
                <Side className={'container'}>
                    <VisittkortComponent data={personOpplysninger} />
                    <Tabs
                        defaultAktiv={tabvalg}
                        tabs={[
                            { label: 'Personopplysninger' },
                            { label: 'Behandlingsoversikt' },
                            { label: 'Vedtaksperioder', disabled: true },
                            { label: 'Dokumentoversikt', disabled: true },
                        ]}
                        onChange={(_, tabNumber) => settTabvalg(tabNumber)}
                    />
                    {tabvalg === 0 && (
                        <Personopplysninger personopplysninger={personOpplysninger} />
                    )}
                    {tabvalg === 1 && (
                        <Behandlingsoversikt
                            fagsakId={fagsakId}
                            personIdent={personOpplysninger.personIdent}
                        />
                    )}
                </Side>
            )}
        </DataViewer>
    );
};

export default Personoversikt;
