import React, { useEffect, useState } from 'react';
import { BrevStruktur } from './BrevTyper';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { IPersonopplysninger } from '../../../typer/personopplysninger';
import BrevmenyVisning from './BrevmenyVisning';

export interface BrevmenyProps {
    oppdaterBrevRessurs: (brevRessurs: Ressurs<string>) => void;
    behandlingId: string;
    personopplysninger: IPersonopplysninger;
    settKanSendesTilBeslutter: (kanSendesTilBeslutter: boolean) => void;
}

const brevMal = 'innvilgetOvergangsstonadHoved2';
const datasett = 'ef-brev';

const Brevmeny: React.FC<BrevmenyProps> = (props) => {
    const { axiosRequest } = useApp();
    const [brevStruktur, settBrevStruktur] = useState<Ressurs<BrevStruktur>>(byggTomRessurs());

    useEffect(() => {
        axiosRequest<BrevStruktur, null>({
            method: 'GET',
            url: `/familie-brev/api/${datasett}/avansert-dokument/bokmaal/${brevMal}/felter`,
        }).then((respons: Ressurs<BrevStruktur>) => {
            settBrevStruktur(respons);
        });
        // eslint-disable-next-line
    }, []);

    return (
        <DataViewer response={{ brevStruktur }}>
            {({ brevStruktur }) => <BrevmenyVisning {...props} brevStruktur={brevStruktur} />}
        </DataViewer>
    );
};

export default Brevmeny;
