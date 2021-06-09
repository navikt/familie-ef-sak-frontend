import React, { useEffect, useState } from 'react';
import { BrevStruktur } from './BrevTyper';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { IPersonopplysninger } from '../../../typer/personopplysninger';
import BrevmenyVisning from './BrevmenyVisning';
import { IVedtak } from '../../../typer/vedtak';

export interface BrevmenyProps {
    oppdaterBrevRessurs: (brevRessurs: Ressurs<string>) => void;
    behandlingId: string;
    personopplysninger: IPersonopplysninger;
    settKanSendesTilBeslutter: (kanSendesTilBeslutter: boolean) => void;
}

export const brevMal = 'htmlDokument';
const datasett = 'testdata';

const Brevmeny: React.FC<BrevmenyProps> = (props) => {
    const { axiosRequest } = useApp();
    const [brevStruktur, settBrevStruktur] = useState<Ressurs<BrevStruktur>>(byggTomRessurs());
    const [vedtak, settVedtak] = useState<Ressurs<IVedtak | undefined>>(byggTomRessurs());

    useEffect(() => {
        axiosRequest<BrevStruktur, null>({
            method: 'GET',
            url: `/familie-brev/api/${datasett}/avansert-dokument/bokmaal/${brevMal}/felter`,
        }).then((respons: Ressurs<BrevStruktur>) => {
            settBrevStruktur(respons);
        });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        axiosRequest<IVedtak, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/vedtak/${props.behandlingId}`,
        }).then((respons: Ressurs<IVedtak | undefined>) => {
            settVedtak(respons);
        });
        // eslint-disable-next-line
    }, []);

    return (
        <DataViewer response={{ brevStruktur, vedtak }}>
            {({ brevStruktur, vedtak }) => (
                <BrevmenyVisning {...props} brevStruktur={brevStruktur} vedtak={vedtak} />
            )}
        </DataViewer>
    );
};

export default Brevmeny;
