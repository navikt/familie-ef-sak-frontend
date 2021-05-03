import React, { useEffect, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import PdfVisning from '../../Felleskomponenter/PdfVisning';
import styled from 'styled-components';
import { Knapp } from 'nav-frontend-knapper';
import SendTilBeslutterFooter from '../Totrinnskontroll/SendTilBeslutterFooter';
import { useBehandling } from '../../../context/BehandlingContext';

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
interface DokumentMal {
    dokument: DokumentFelt[];
}

interface DokumentFelt {
    valgFeltKategori: string;
    visningnavn: string;
}

const Brev: React.FC<Props> = ({ behandlingId }) => {
    const { axiosRequest } = useApp();
    const [brevRessurs, settBrevRessurs] = useState<Ressurs<string>>(byggTomRessurs());
    const { behandlingErRedigerbar } = useBehandling();
    const [dokumentFelter, settDokumentFelter] = useState<Ressurs<DokumentMal>>(byggTomRessurs());

    const data = { navn: 'test', ident: '123456789' };

    useEffect(() => {
        axiosRequest<DokumentMal, null>({
            method: 'GET',
            url: `/familie-brev/api/EF/avansert-dokument/bokmaal/innvilgetOvergangsstonadHovedp/felter`,
        }).then((respons: Ressurs<DokumentMal>) => {
            settDokumentFelter(respons);
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
    console.log(dokumentFelter);

    return (
        <>
            <StyledBrev>
                {behandlingErRedigerbar && (
                    <GenererBrev onClick={genererBrev}>Generer brev</GenererBrev>
                )}
                <HentBrev onClick={hentBrev}>Hent brev</HentBrev>
                <PdfVisning pdfFilInnhold={brevRessurs} />
            </StyledBrev>
            {behandlingErRedigerbar && <SendTilBeslutterFooter behandlingId={behandlingId} />}
        </>
    );
};

export default Brev;
