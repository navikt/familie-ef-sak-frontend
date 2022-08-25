import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Select } from 'nav-frontend-skjema';
import { IOppgave } from '../Oppgavebenk/typer/oppgave';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';

const VelgUstrukturertDokumentasjonTypeSelect = styled(Select)`
    width: 10rem;
    margin: 1rem 0;
`;

const AdvarselVisning = styled(AlertStripeAdvarsel)`
    margin: 0.5rem 0;
    max-width: 60rem;

    .alertstripe__tekst {
        max-width: 60rem;
    }
`;

export enum UstrukturertDokumentasjonType {
    PAPIRSØKNAD = 'PAPIRSØKNAD',
    ETTERSENDING = 'ETTERSENDNING',
    IKKE_VALGT = 'IKKE_VALGT',
}

const ustrukturertTypeTilTekst: Record<UstrukturertDokumentasjonType, string> = {
    PAPIRSØKNAD: 'Papirsøknad',
    ETTERSENDNING: 'Ettersendning',
    IKKE_VALGT: 'Ikke valgt',
};

const AdvarselPapirsøknad = (
    <div>
        <div>Årsak til behandling settes til papirsøknad</div>
        <AdvarselVisning>
            Journalføring av papirsøknad må delvis gjøres i gosys:
            <ul>
                <li>Avsender må settes</li>
                <li>Legge til vedlegg (hvis aktuelt)</li>
                <li>Endre tittel på vedlegg (hvis aktuelt)</li>
            </ul>
            Når endringene er gjort, trykker du på "Lagre utkast" før du går tilbake til EF Sak og
            journalfører.
        </AdvarselVisning>
    </div>
);

const VelgUstrukturertDokumentasjonType: React.FC<{
    oppgaveId: string;
    ustrukturertDokumentasjonType: UstrukturertDokumentasjonType | undefined;
    settUstrukturertDokumentasjonType: React.Dispatch<
        React.SetStateAction<UstrukturertDokumentasjonType | undefined>
    >;
}> = ({ oppgaveId, ustrukturertDokumentasjonType, settUstrukturertDokumentasjonType }) => {
    const { axiosRequest } = useApp();
    const [oppgave, settOppgave] = useState<Ressurs<IOppgave>>(byggTomRessurs());

    useEffect(() => {
        axiosRequest<IOppgave, undefined>({
            method: 'GET',
            url: `/familie-ef-sak/api/oppgave/oppslag/${oppgaveId}`,
        }).then((res: Ressurs<IOppgave>) => settOppgave(res));
    }, [axiosRequest, oppgaveId]);

    useEffect(() => {
        if (
            oppgave.status === RessursStatus.SUKSESS &&
            oppgave.data.behandlesAvApplikasjon === 'familie-ef-sak'
        ) {
            settUstrukturertDokumentasjonType(UstrukturertDokumentasjonType.ETTERSENDING);
        }
    }, [settUstrukturertDokumentasjonType, oppgave]);

    return (
        <DataViewer response={{ oppgave }}>
            {() => {
                return (
                    <>
                        <VelgUstrukturertDokumentasjonTypeSelect
                            label="Type dokumentasjon"
                            onChange={(e) => {
                                settUstrukturertDokumentasjonType(
                                    e.target.value as UstrukturertDokumentasjonType
                                );
                            }}
                            value={ustrukturertDokumentasjonType}
                        >
                            {[
                                UstrukturertDokumentasjonType.IKKE_VALGT,
                                UstrukturertDokumentasjonType.PAPIRSØKNAD,
                                UstrukturertDokumentasjonType.ETTERSENDING,
                            ].map((type) => (
                                <option key={type} value={type}>
                                    {ustrukturertTypeTilTekst[type]}
                                </option>
                            ))}
                        </VelgUstrukturertDokumentasjonTypeSelect>
                        {ustrukturertDokumentasjonType ===
                            UstrukturertDokumentasjonType.PAPIRSØKNAD && AdvarselPapirsøknad}
                    </>
                );
            }}
        </DataViewer>
    );
};

export default VelgUstrukturertDokumentasjonType;
