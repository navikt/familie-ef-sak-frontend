import React, { useCallback, useEffect, useState } from 'react';
import { useApp } from '../../App/context/AppContext';
import OppgaveTabell, { IOppgaverResponse } from './OppgaveTabell';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../App/typer/ressurs';
import { IOppgaveRequest } from './typer/oppgaverequest';
import { OpprettDummyBehandling } from './OpprettDummyBehandling';
import { Side } from '../../Felles/Visningskomponenter/Side';
import { IMappe } from './typer/mappe';
import OppgaveFiltering from './OppgaveFiltrering';
import { erProd } from '../../App/utils/miljø';

export type OppgaveRessurs = Ressurs<IOppgaverResponse>;

export const OppgavebenkApp: React.FC = () => {
    const { axiosRequest } = useApp();
    const [oppgaveResurs, settOppgaveResurs] = useState<OppgaveRessurs>(byggTomRessurs());
    const [mapper, settMapper] = useState<Record<number, string>>({});

    const hentOppgaver = useCallback(
        (data: IOppgaveRequest) => {
            axiosRequest<IOppgaverResponse, IOppgaveRequest>({
                method: 'POST',
                url: `/familie-ef-sak/api/oppgave/soek`,
                data,
            }).then((res: Ressurs<IOppgaverResponse>) => settOppgaveResurs(res));
        },
        [axiosRequest]
    );
    const mapperAsRecord = (mapper: IMappe[]): Record<number, string> =>
        mapper.reduce((acc, item) => {
            acc[item.id] = item.navn;
            return acc;
        }, {} as Record<number, string>);

    useEffect(() => {
        axiosRequest<IMappe[], null>({
            method: 'GET',
            url: `/familie-ef-sak/api/oppgave/mapper`,
        }).then((res: Ressurs<IMappe[]>) => {
            res.status === RessursStatus.SUKSESS && settMapper(mapperAsRecord(res.data));
        });
    }, [axiosRequest]);

    return (
        <Side className={'container'}>
            {!erProd() && <OpprettDummyBehandling />}
            <OppgaveFiltering hentOppgaver={hentOppgaver} mapper={mapper} />
            <OppgaveTabell oppgaveRessurs={oppgaveResurs} mapper={mapper} />
        </Side>
    );
};
