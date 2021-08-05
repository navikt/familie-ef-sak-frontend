import React, { useEffect, useState } from 'react';
import { BrevStruktur, DokumentNavn } from './BrevTyper';
import { byggTomRessurs, Ressurs } from '../../typer/ressurs';
import { useApp } from '../../context/AppContext';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { IPersonopplysninger } from '../../typer/personopplysninger';
import BrevmenyVisning from './BrevmenyVisning';
import { TilkjentYtelse } from '../../typer/tilkjentytelse';
import { Select } from 'nav-frontend-skjema';
import styled from 'styled-components';

export interface BrevmenyProps {
    oppdaterBrevRessurs: (brevRessurs: Ressurs<string>) => void;
    behandlingId: string;
    personopplysninger: IPersonopplysninger;
    settKanSendesTilBeslutter: (kanSendesTilBeslutter: boolean) => void;
}

const StyledBrevMeny = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 450px;
`;

const datasett = 'ef-brev';

const Brevmeny: React.FC<BrevmenyProps> = (props) => {
    const { axiosRequest } = useApp();
    const [brevMal, settBrevmal] = useState<string>('');
    const [brevStruktur, settBrevStruktur] = useState<Ressurs<BrevStruktur>>(byggTomRessurs());
    const [dokumentnavn, settDokumentnavn] = useState<DokumentNavn | undefined>();
    const [tilkjentYtelse, settTilkjentYtelse] = useState<Ressurs<TilkjentYtelse | undefined>>(
        byggTomRessurs()
    );

    useEffect(() => {
        axiosRequest<DokumentNavn[], null>({
            method: 'GET',
            url: `/familie-brev/api/${datasett}/avansert-dokument/navn`,
        }).then((respons: Ressurs<DokumentNavn[]>) => {
            console.log('RESPONS', respons);
            settDokumentnavn(respons);
        });
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (brevMal) {
            axiosRequest<BrevStruktur, null>({
                method: 'GET',
                url: `/familie-brev/api/${datasett}/avansert-dokument/bokmaal/${brevMal}/felter`,
            }).then((respons: Ressurs<BrevStruktur>) => {
                console.log('BREVSTRUKTUR', respons);
                settBrevStruktur(respons);
            });
        }
        // eslint-disable-next-line
    }, [brevMal]);

    useEffect(() => {
        axiosRequest<TilkjentYtelse, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/tilkjentytelse/behandling/${props.behandlingId}`,
        }).then((respons: Ressurs<TilkjentYtelse>) => {
            settTilkjentYtelse(respons);
        });
        // eslint-disable-next-line
    }, [brevMal]);

    console.log('dok', dokumentnavn);

    return (
        <StyledBrevMeny>
            <Select
                label="Velg dokument"
                onChange={(e) => {
                    console.log(e.target.value);
                    settBrevmal(e.target.value);
                }}
            >
                <option value="">Ikke valgt</option>
                {dokumentnavn?.data.map((navn: DokumentNavn) => (
                    <option value={navn.apiNavn} key={navn.apiNavn}>
                        {navn.visningsnavn}
                    </option>
                ))}
            </Select>
            <DataViewer response={{ brevStruktur, tilkjentYtelse }}>
                {({ brevStruktur, tilkjentYtelse }) => (
                    <BrevmenyVisning
                        {...props}
                        brevStruktur={brevStruktur}
                        tilkjentYtelse={tilkjentYtelse}
                        brevMal={brevMal}
                    />
                )}
            </DataViewer>
        </StyledBrevMeny>
    );
};

export default Brevmeny;
