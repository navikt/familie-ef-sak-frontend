import React, { FC, useEffect, useState } from 'react';
import { Select } from '@navikt/ds-react';
import { IMappe } from '../../Oppgavebenk/typer/mappe';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { sorterMapperPåNavn } from '../../Oppgavebenk/utils';

export const MappeVelger: FC<{
    oppgaveEnhet: string | undefined;
    valgtMappe: number | undefined;
    settMappe: (mappe: number | undefined) => void;
}> = ({ valgtMappe, settMappe, oppgaveEnhet }) => {
    const [mapper, settMapper] = useState<Ressurs<IMappe[]>>(byggTomRessurs());
    const { axiosRequest } = useApp();

    useEffect(() => {
        axiosRequest<IMappe[], null>({
            method: 'GET',
            url: `/familie-ef-sak/api/oppgave/mapper`,
        }).then((res: Ressurs<IMappe[]>) => {
            settMapper(res);
        });
    }, [axiosRequest]);

    return (
        <div>
            <DataViewer response={{ mapper }}>
                {({ mapper }) => {
                    const upplassertMappe = 'uplassert';

                    const aktuelleMapper = mapper
                        .filter((mappe) => mappe.enhetsnr === oppgaveEnhet)
                        .sort(sorterMapperPåNavn);

                    return (
                        <Select
                            disabled={oppgaveEnhet === undefined}
                            label={'Mappe'}
                            size={'small'}
                            value={valgtMappe}
                            onChange={(e) => {
                                const verdi = e.target.value;
                                settMappe(verdi === upplassertMappe ? undefined : parseInt(verdi));
                            }}
                        >
                            <option value={upplassertMappe}>Uplassert</option>
                            {aktuelleMapper?.map((mappe) => (
                                <option key={mappe.id} value={mappe.id}>
                                    {mappe.navn}
                                </option>
                            ))}
                        </Select>
                    );
                }}
            </DataViewer>
        </div>
    );
};
