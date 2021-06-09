import React, { useEffect, useState } from 'react';
import { BrevStruktur, TilkjentYtelse } from './BrevTyper';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../typer/ressurs';
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

export const brevMal = 'htmlDokument';
const datasett = 'testdata';

const Brevmeny: React.FC<BrevmenyProps> = (props) => {
    const { axiosRequest } = useApp();
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
        /*axiosRequest<IVedtak, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/vedtak/${props.behandlingId}`,
        }).then((respons: Ressurs<IVedtak | undefined>) => {
            settVedtak(respons);
        });*/
        settTilkjentYtelse({
            status: RessursStatus.SUKSESS,
            data: {
                andeler: [
                    {
                        beløp: 123,
                        fraDato: '2021-01-01',
                        tilDato: '2021-03-31',
                        inntekt: 30000,
                    },
                    {
                        beløp: 321,
                        fraDato: '2021-05-01',
                        tilDato: '2021-07-31',
                        inntekt: 1000,
                    },
                ],
            },
        });
        // eslint-disable-next-line
    }, []);

    return (
        <DataViewer response={{ brevStruktur, tilkjentYtelse }}>
            {({ brevStruktur, tilkjentYtelse }) => (
                <BrevmenyVisning
                    {...props}
                    brevStruktur={brevStruktur}
                    tilkjentYtelse={tilkjentYtelse}
                />
            )}
        </DataViewer>
    );
};

export default Brevmeny;
