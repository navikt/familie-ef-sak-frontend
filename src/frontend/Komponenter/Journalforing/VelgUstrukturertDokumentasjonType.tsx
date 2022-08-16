import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Select } from 'nav-frontend-skjema';
import { IOppgave } from '../Oppgavebenk/typer/oppgave';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { useApp } from '../../App/context/AppContext';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { Behandlingsårsak } from '../../App/typer/Behandlingsårsak';

const VelgUstrukturertDokumentasjonTypeSelect = styled(Select)`
    width: 10rem;
    margin: 1rem 0;
`;

export enum UstrukturertDokumentasjonType {
    PAPIRSØKNAD = 'PAPIRSØKNAD',
    ETTERSENDING = 'ETTERSENDNING',
}

const ustrukturertTypeTilTekst: Record<UstrukturertDokumentasjonType, string> = {
    PAPIRSØKNAD: 'Papirsøknad',
    ETTERSENDNING: 'Ettersendning',
};

export const behandlingsårsakFraDokumentasjonType: Record<
    UstrukturertDokumentasjonType,
    Behandlingsårsak
> = {
    PAPIRSØKNAD: Behandlingsårsak.PAPIRSØKNAD,
    ETTERSENDNING: Behandlingsårsak.NYE_OPPLYSNINGER,
};

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
                                if (e.target.value.trim() !== '') {
                                    settUstrukturertDokumentasjonType(
                                        e.target.value as UstrukturertDokumentasjonType
                                    );
                                } else {
                                    settUstrukturertDokumentasjonType(undefined);
                                }
                            }}
                            value={ustrukturertDokumentasjonType}
                        >
                            <option value={''}>Ikke valgt</option>
                            {[
                                UstrukturertDokumentasjonType.PAPIRSØKNAD,
                                UstrukturertDokumentasjonType.ETTERSENDING,
                            ].map((type) => (
                                <option key={type} value={type}>
                                    {ustrukturertTypeTilTekst[type]}
                                </option>
                            ))}
                        </VelgUstrukturertDokumentasjonTypeSelect>
                        {ustrukturertDokumentasjonType ===
                            UstrukturertDokumentasjonType.PAPIRSØKNAD && (
                            <div>Årsak til behandling kommer settes til papirsøknad</div>
                        )}
                    </>
                );
            }}
        </DataViewer>
    );
};

export default VelgUstrukturertDokumentasjonType;
