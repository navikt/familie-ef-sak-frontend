import React, { useEffect, useState } from 'react';
import { BrevStruktur } from './BrevTyper';
import { byggTomRessurs, Ressurs } from '../../typer/ressurs';
import { useApp } from '../../context/AppContext';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { IPersonopplysninger } from '../../typer/personopplysninger';
import BrevmenyVisning from './BrevmenyVisning';
import { TilkjentYtelse } from '../../typer/tilkjentytelse';
import { useMellomlagringBrev } from '../../hooks/useMellomlagringBrev';

export interface BrevmenyProps {
    oppdaterBrevRessurs: (brevRessurs: Ressurs<string>) => void;
    behandlingId: string;
    personopplysninger: IPersonopplysninger;
    settKanSendesTilBeslutter: (kanSendesTilBeslutter: boolean) => void;
}

export const brevMal = 'innvilgetOvergangsstonadHoved2';
const datasett = 'ef-brev';

const Brevmeny: React.FC<BrevmenyProps> = (props) => {
    const { axiosRequest } = useApp();
    const { mellomlagretBrev } = useMellomlagringBrev(props.behandlingId);
    const [brevStruktur, settBrevStruktur] = useState<Ressurs<BrevStruktur>>(byggTomRessurs());
    const [tilkjentYtelse, settTilkjentYtelse] = useState<Ressurs<TilkjentYtelse | undefined>>(
        byggTomRessurs()
    );

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
        axiosRequest<TilkjentYtelse, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/tilkjentytelse/behandling/${props.behandlingId}`,
        }).then((respons: Ressurs<TilkjentYtelse>) => {
            settTilkjentYtelse(respons);
        });
        // eslint-disable-next-line
    }, []);

    return (
        <DataViewer response={{ brevStruktur, tilkjentYtelse, mellomlagretBrev }}>
            {({ brevStruktur, tilkjentYtelse, mellomlagretBrev }) => (
                <BrevmenyVisning
                    {...props}
                    brevStruktur={brevStruktur}
                    tilkjentYtelse={tilkjentYtelse}
                    mellomlagretBrev={mellomlagretBrev}
                />
            )}
        </DataViewer>
    );
};

export default Brevmeny;
