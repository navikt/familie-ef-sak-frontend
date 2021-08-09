import React, { useEffect, useState } from 'react';
import { BrevStruktur, DokumentNavn } from './BrevTyper';
import { byggTomRessurs, Ressurs } from '../../typer/ressurs';
import { useApp } from '../../context/AppContext';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { IPersonopplysninger } from '../../typer/personopplysninger';
import BrevmenyVisning from './BrevmenyVisning';
import { TilkjentYtelse } from '../../typer/tilkjentytelse';
import { useMellomlagringBrev } from '../../hooks/useMellomlagringBrev';
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
    const { mellomlagretBrev } = useMellomlagringBrev(props.behandlingId);

    const defaultBrevmal = 'innvilgetOvergangsstonadHoved2';
    const [brevMal, settBrevmal] = useState<string>(defaultBrevmal);
    const [brevStruktur, settBrevStruktur] = useState<Ressurs<BrevStruktur>>(byggTomRessurs());
    const [dokumentnavn, settDokumentnavn] = useState<Ressurs<DokumentNavn[] | undefined>>(
        byggTomRessurs()
    );
    const [tilkjentYtelse, settTilkjentYtelse] = useState<Ressurs<TilkjentYtelse | undefined>>(
        byggTomRessurs()
    );

    useEffect(() => {
        if (brevMal) {
            axiosRequest<BrevStruktur, null>({
                method: 'GET',
                url: `/familie-brev/api/${datasett}/avansert-dokument/bokmaal/${brevMal}/felter`,
            }).then((respons: Ressurs<BrevStruktur>) => {
                settBrevStruktur(respons);
            });
        }
        // eslint-disable-next-line
    }, [brevMal]);

    useEffect(() => {
        axiosRequest<DokumentNavn[], null>({
            method: 'GET',
            url: `/familie-brev/api/${datasett}/avansert-dokument/navn`,
        }).then((respons: Ressurs<DokumentNavn[]>) => {
            settDokumentnavn(respons);
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
    }, [brevMal]);

    return (
        <StyledBrevMeny>
            <DataViewer response={{ dokumentnavn }}>
                {({ dokumentnavn }) => (
                    <Select
                        label="Velg dokument"
                        defaultValue={defaultBrevmal}
                        onChange={(e) => {
                            settBrevmal(e.target.value);
                        }}
                    >
                        <option value="">Ikke valgt</option>
                        {dokumentnavn?.map((navn: DokumentNavn) => (
                            <option value={navn.apiNavn} key={navn.apiNavn}>
                                {navn.visningsnavn}
                            </option>
                        ))}
                    </Select>
                )}
            </DataViewer>
            <DataViewer response={{ brevStruktur, tilkjentYtelse, mellomlagretBrev }}>
                {({ brevStruktur, tilkjentYtelse, mellomlagretBrev }) => (
                    <BrevmenyVisning
                        {...props}
                        brevStruktur={brevStruktur}
                        tilkjentYtelse={tilkjentYtelse}
                        brevMal={brevMal}
                        mellomlagretBrev={mellomlagretBrev}
                    />
                )}
            </DataViewer>
        </StyledBrevMeny>
    );
};

export default Brevmeny;
