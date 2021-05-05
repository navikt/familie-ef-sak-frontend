import React, { useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../typer/ressurs';
import PdfVisning from '../../Felleskomponenter/PdfVisning';
import styled from 'styled-components';
import { Knapp } from 'nav-frontend-knapper';
import SendTilBeslutterFooter from '../Totrinnskontroll/SendTilBeslutterFooter';
import { useBehandling } from '../../../context/BehandlingContext';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import Brevmeny from './Brevmeny';

const GenererBrev = styled(Knapp)`
    display: block;
    margin: 0 auto;
`;

const HentBrev = styled(Knapp)`
    display: block;
    margin: 2rem auto;
`;

const StyledBrev = styled.div`
    background-color: #f2f2f2;
    padding: 3rem;
`;

interface Props {
    behandlingId: string;
}
type ValgtFelt = { [valgFeltKategori: string]: Valgmulighet };

export interface DokumentMal {
    dokument: DokumentFelt[];
}

interface Flettefelt {
    _id: string;
    felt: string;
}

export interface FletteMedVerdi extends Flettefelt {
    verdi: string | null;
}

export interface Valgmulighet {
    flettefelt: Flettefelt[];
    valgmulighet: string;
    visningsnavnValgmulighet: string;
}

export interface DokumentFelt {
    valgFeltKategori: string;
    visningsnavn: string;
    valgMuligheter: Valgmulighet[];
}

const Brev: React.FC<Props> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();
    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());
    const { behandlingErRedigerbar } = useBehandling();
    const [dokumentFelter, settDokumentFelter] = useState<Ressurs<DokumentMal>>(byggTomRessurs());
    const [fletteFelter, settFletteFelter] = useState<FletteMedVerdi[]>([] as FletteMedVerdi[]);
    const [valgteFelt, settValgteFelt] = useState<{ [valgFeltKategori: string]: Valgmulighet }>(
        {} as ValgtFelt
    );
    const data = { navn: 'test', ident: '123456789' };

    useEffect(() => {
        axiosRequest<DokumentMal, null>({
            method: 'GET',
            url: `/familie-brev/api/EF/avansert-dokument/bokmaal/innvilgetOvergangsstonadHovedp/felter`,
        }).then((respons: Ressurs<DokumentMal>) => {
            settDokumentFelter(respons);
            if (respons.status === RessursStatus.SUKSESS) {
                settFletteFelter(
                    respons.data.dokument
                        .flatMap((dok) =>
                            dok.valgMuligheter.flatMap((valMulighet) => valMulighet.flettefelt)
                        )
                        .filter((v) => Object.keys(v).length > 0)
                        .map((v) => ({ ...v, verdi: null }))
                        .filter(
                            (v, i, a) =>
                                a.findIndex((t) => JSON.stringify(t) === JSON.stringify(v)) === i
                        )
                );
            }
        });
    }, []);

    const genererBrev = () => {
        // eslint-disable-next-line
        axiosRequest<string, any>({
            method: 'POST',
            url: `/familie-ef-sak/api/brev/${behandlingId}`,
            data: data,
        }).then((respons: Ressurs<string>) => {
            settBrevRessurs(respons);
        });
    };

    const hentBrev = () => {
        // eslint-disable-next-line
        axiosRequest<string, any>({
            method: 'GET',
            url: `/familie-ef-sak/api/brev/${behandlingId}`,
        }).then((respons: Ressurs<string>) => {
            settBrevRessurs(respons);
        });
    };

    console.log('fletteFelt:', fletteFelter);
    return (
        <DataViewer response={{ dokumentFelter }}>
            {({ dokumentFelter }) => {
                return (
                    <>
                        <StyledBrev>
                            <Brevmeny
                                dokument={dokumentFelter.dokument}
                                valgteFelt={valgteFelt}
                                settValgteFelt={settValgteFelt}
                                settFlettefelter={settFletteFelter}
                                fletteFelter={fletteFelter}
                            />
                            {behandlingErRedigerbar && (
                                <GenererBrev onClick={genererBrev}>Generer brev</GenererBrev>
                            )}
                            <HentBrev onClick={hentBrev}>Hent brev</HentBrev>
                            <PdfVisning pdfFilInnhold={brevRessurs} />
                        </StyledBrev>
                        {behandlingErRedigerbar && (
                            <SendTilBeslutterFooter behandlingId={behandlingId} />
                        )}
                    </>
                );
            }}
        </DataViewer>
    );
};

export default Brev;
