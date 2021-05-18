import React, { useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import PdfVisning from '../../Felleskomponenter/PdfVisning';
import styled from 'styled-components';
import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import SendTilBeslutterFooter from '../Totrinnskontroll/SendTilBeslutterFooter';
import { useBehandling } from '../../../context/BehandlingContext';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import Brevmeny from './Brevmeny';
import { RessursStatus } from '@navikt/familie-typer';

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

export interface BrevStruktur {
    dokument: DokumentMal;
    flettefelter: Flettefelter;
}
export interface DokumentMal {
    delmaler: Delmal[];
}

export interface Flettefelter {
    flettefeltReferanse: Flettefelt[];
}
interface Flettefelt {
    felt: string;
    _id: string;
}

export interface Flettefeltreferanse {
    _ref: string;
}

export interface FlettefeltMedVerdi extends Flettefeltreferanse {
    verdi: string | null;
}

export interface Valgmulighet {
    flettefelter: Flettefelter[];
    valgmulighet: string;
    visningsnavnValgmulighet: string;
}

export interface Flettefelter {
    flettefelt: Flettefeltreferanse[];
}
export interface ValgFelt {
    valgMuligheter: Valgmulighet[];
    valgfeltVisningsnavn: string;
    valgFeltApiNavn: string;
}

export interface Delmal {
    delmalApiNavn: string;
    delmalNavn: string;
    delmalValgfelt: ValgFelt[];
    delmalFlettefelter: Flettefelter[]; // referanse til flettefelt
}

const Brev: React.FC<Props> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();
    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());
    const { behandlingErRedigerbar } = useBehandling();
    const [brevStruktur, settBrevStruktur] = useState<Ressurs<BrevStruktur>>(byggTomRessurs());
    const [alleFlettefelter, settAlleFlettefelter] = useState<FlettefeltMedVerdi[]>(
        [] as FlettefeltMedVerdi[]
    );
    const [valgteFelt, settValgteFelt] = useState<{ [valgFeltKategori: string]: Valgmulighet }>(
        {} as ValgtFelt
    );
    const data = { navn: 'test', ident: '123456789' };

    const brevMal = 'innvilgetOvergangsstonadHovedp';
    // const brevMal = 'innvilgetVedtakMVP';

    useEffect(() => {
        axiosRequest<BrevStruktur, null>({
            method: 'GET',
            url: `/familie-brev/api/ef-brev/avansert-dokument/bokmaal/${brevMal}/felter`,
        }).then((respons: Ressurs<BrevStruktur>) => {
            if (respons.status === RessursStatus.SUKSESS) {
                settBrevStruktur(respons);
                settAlleFlettefelter(
                    respons.data.flettefelter.flettefeltReferanse.map((felt) => ({
                        _ref: felt._id,
                        verdi: null,
                    }))
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
    const genererBrev2 = () => {
        const req = {};

        axiosRequest<string, any>({
            method: 'POST',
            url: `/familie-ef-sak/api/brev/${behandlingId}/v2`,
            data: {
                valgfelter: req,
                delmalData: {
                    signatur: {
                        enhet: ['Nav arbeid og ... - OSLO'],
                        saksbehandler: 'Batman',
                    },
                },
                flettefelter: {
                    navn: ['$navn'],
                    fodselsnummer: ['$ident'],
                    'Fom-dato innvilgelse': ['$innvilgelseFra'],
                    'Tom-dato innvilgelse': ['$innvilgelseTil'],
                    begrunnelseFomDatoInnvilgelse: ['$begrunnelseFomDatoInnvilgelse'],
                    dato: ['$brevdato'],
                    belopOvergangsstonad: ['$belopOvergangsstonad'],
                },
            },
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

    return (
        <DataViewer response={{ dokumentFelter: brevStruktur }}>
            {({ dokumentFelter }) => {
                return (
                    <>
                        <StyledBrev>
                            <Brevmeny
                                dokument={dokumentFelter}
                                valgteFelt={valgteFelt}
                                settValgteFelt={settValgteFelt}
                                flettefelter={alleFlettefelter}
                                settFlettefelter={settAlleFlettefelter}
                            />
                            {behandlingErRedigerbar && (
                                <GenererBrev onClick={genererBrev}>Generer brev</GenererBrev>
                            )}
                            <HentBrev onClick={hentBrev}>Hent brev</HentBrev>
                            <PdfVisning pdfFilInnhold={brevRessurs} />
                            <Hovedknapp onClick={genererBrev2}>Generer brev2!!!</Hovedknapp>
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
