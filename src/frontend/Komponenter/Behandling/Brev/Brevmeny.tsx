import React, { useEffect, useState } from 'react';
import { BrevStruktur, DokumentNavn, FritekstBrevContext } from './BrevTyper';
import {
    byggSuksessRessurs,
    byggTomRessurs,
    Ressurs,
    RessursStatus,
} from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import BrevmenyVisning from './BrevmenyVisning';
import { TilkjentYtelse } from '../../../App/typer/tilkjentytelse';
import { Select } from 'nav-frontend-skjema';
import styled from 'styled-components';
import { useMellomlagringBrev } from '../../../App/hooks/useMellomlagringBrev';
import { useVerdierForBrev } from '../../../App/hooks/useVerdierForBrev';
import {
    harVedtaksresultatMedTilkjentYtelse,
    useHentVedtak,
} from '../../../App/hooks/useHentVedtak';
import FritekstBrev from './FritekstBrev';

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
    const { hentVedtak, vedtaksresultat } = useHentVedtak(props.behandlingId);
    const [brevMal, settBrevmal] = useState<string>();
    const [brevStruktur, settBrevStruktur] = useState<Ressurs<BrevStruktur>>(byggTomRessurs());
    const [dokumentnavn, settDokumentnavn] = useState<Ressurs<DokumentNavn[] | undefined>>(
        byggTomRessurs()
    );
    const [tilkjentYtelse, settTilkjentYtelse] = useState<Ressurs<TilkjentYtelse | undefined>>(
        byggTomRessurs()
    );

    const { mellomlagretBrev } = useMellomlagringBrev(props.behandlingId);
    const { flettefeltStore } = useVerdierForBrev(tilkjentYtelse);

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
        if (harVedtaksresultatMedTilkjentYtelse(vedtaksresultat)) {
            axiosRequest<TilkjentYtelse, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/tilkjentytelse/behandling/${props.behandlingId}`,
            }).then((respons: Ressurs<TilkjentYtelse>) => {
                settTilkjentYtelse(respons);
            });
        } else {
            settTilkjentYtelse(byggSuksessRessurs<TilkjentYtelse | undefined>(undefined));
        }
        // eslint-disable-next-line
    }, [harVedtaksresultatMedTilkjentYtelse, vedtaksresultat]);

    useEffect(() => {
        hentVedtak();
    }, [hentVedtak]);

    useEffect(() => {
        if (mellomlagretBrev.status === RessursStatus.SUKSESS) {
            settBrevmal(mellomlagretBrev?.data?.brevmal);
        }
    }, [mellomlagretBrev]);

    return (
        <StyledBrevMeny>
            <DataViewer response={{ dokumentnavn }}>
                {({ dokumentnavn }) => (
                    <Select
                        label="Velg dokument"
                        defaultValue={brevMal}
                        onChange={(e) => {
                            settBrevmal(e.target.value);
                        }}
                        value={brevMal}
                    >
                        <option value="">Ikke valgt</option>
                        {dokumentnavn?.map((navn: DokumentNavn) => (
                            <option value={navn.apiNavn} key={navn.apiNavn}>
                                {navn.visningsnavn}
                            </option>
                        ))}
                        <option value={'Fritekstbrev'} key={'Fritekstbrev'}>
                            {' '}
                            Fritekstbrev
                        </option>
                    </Select>
                )}
            </DataViewer>
            {brevMal === 'Fritekstbrev' ? (
                <FritekstBrev
                    behandlingId={props.behandlingId}
                    oppdaterBrevressurs={props.oppdaterBrevRessurs}
                    context={FritekstBrevContext.BEHANDLING}
                />
            ) : (
                <DataViewer response={{ brevStruktur, tilkjentYtelse, mellomlagretBrev }}>
                    {({ brevStruktur, tilkjentYtelse, mellomlagretBrev }) =>
                        brevMal && (
                            <BrevmenyVisning
                                {...props}
                                brevStruktur={brevStruktur}
                                tilkjentYtelse={tilkjentYtelse}
                                brevMal={brevMal}
                                mellomlagretBrevVerdier={mellomlagretBrev?.brevverdier}
                                flettefeltStore={flettefeltStore}
                            />
                        )
                    }
                </DataViewer>
            )}
        </StyledBrevMeny>
    );
};

export default Brevmeny;
