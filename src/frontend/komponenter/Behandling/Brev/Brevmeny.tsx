import React, { useEffect, useState } from 'react';
//import { AndelTilkjentYtelse, BrevStruktur, FlettefeltMedVerdi, TilkjentYtelse } from './BrevTyper';
import { BrevStruktur, FlettefeltMedVerdi, TilkjentYtelse } from './BrevTyper';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../typer/ressurs';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { IPersonopplysninger } from '../../../typer/personopplysninger';
import BrevmenyVisning from './BrevmenyVisning';
//import { byggSuksessRessurs } from '@navikt/familie-typer';

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
    const [brevStruktur, settBrevStruktur] = useState<Ressurs<BrevStruktur>>(byggTomRessurs());
    const [tilkjentYtelse, settTilkjentYtelse] = useState<Ressurs<TilkjentYtelse>>(
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

    // const andel: AndelTilkjentYtelse = {
    //     stønadFra: 'wer',
    //     stønadTil: 'wer',
    //     inntekt: 12,
    //     beløp: 12,
    // };
    // const mockTilkjent: TilkjentYtelse = { andeler: [andel] };

    useEffect(() => {
        axiosRequest<TilkjentYtelse, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/tilkjentytelse/behandling/${props.behandlingId}`,
        }).then((respons: Ressurs<TilkjentYtelse>) => {
            console.log(respons);
            settTilkjentYtelse(respons); // BYTT UT MED DEN UNDER
            // @ts-ignore
            //settTilkjentYtelse(byggSuksessRessurs(mockTilkjent));
        });
        // eslint-disable-next-line
    }, []);

    const [mellomlagretFlettefeltMedVerdi, settMellomlagretFlettefeltMedVerdi] = useState<
        Ressurs<FlettefeltMedVerdi[] | undefined>
    >(byggTomRessurs());

    useEffect(() => {
        axiosRequest<FlettefeltMedVerdi[], null>({
            method: 'GET',
            url: `/familie-ef-sak/api/brev/mellomlager/${props.behandlingId}/${brevMal}`,
            headers: {
                'content-type': 'application/json',
                accept: 'application/json',
            },
        }).then((respons: Ressurs<FlettefeltMedVerdi[]>) => {
            // TODO HER HADDE JEG any fram til push
            console.log(respons);
            if (respons.status === RessursStatus.SUKSESS) {
                settMellomlagretFlettefeltMedVerdi(respons);
            }
        });
        // eslint-disable-next-line
    }, []);

    return (
        <DataViewer response={{ brevStruktur, tilkjentYtelse, mellomlagretFlettefeltMedVerdi }}>
            {({ brevStruktur, tilkjentYtelse, mellomlagretFlettefeltMedVerdi }) => (
                <BrevmenyVisning
                    {...props}
                    brevStruktur={brevStruktur}
                    tilkjentYtelse={tilkjentYtelse}
                    mellomlagretFlettefeltMedVerdi={mellomlagretFlettefeltMedVerdi}
                />
            )}
        </DataViewer>
    );
};

export default Brevmeny;
