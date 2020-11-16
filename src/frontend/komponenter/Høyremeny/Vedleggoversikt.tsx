import * as React from 'react';
import { useState } from 'react';
import { VedleggDto } from '../../typer/felles';
import DataViewer from '../Felleskomponenter/DataViewer/DataViewer';
import { Ressurs, RessursStatus } from '../../typer/ressurs';
import { Element, Undertekst } from 'nav-frontend-typografi';
import { useApp } from '../../context/AppContext';
import { saveAs } from 'file-saver';
import styled from 'styled-components';
import navFarger from 'nav-frontend-core';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import Journalpostikon from './Journalpostikon';

interface VedleggoversiktProps {
    vedleggResponse: Ressurs<VedleggDto[]>;
}

const StyledDokument = styled.div`
    padding: 0.5rem 1rem;
    display: grid;
    grid-gap: 0 1rem;
    grid-template-columns: minmax(min-content, max-content);
    grid-template-rows: repeat(2, min-content);
    grid-template-areas:
        'journalposttype tittel'
        'journalposttype dato';
    max-width: 300px;

    :hover {
        cursor: pointer;
        background-color: ${navFarger.navLysGra};
    }
`;

const JournalpostType = styled.span`
    grid-area: journalposttype;
    padding-top: 0.3rem;
`;
const StyledDato = styled(Undertekst)`
    grid-area: dato;
`;

const Vedleggsnavn = styled(Element)`
    text-overflow: ellipsis;
    max-width: 100%;
    overflow: hidden;
    color: ${navFarger.navBla};
    grid-area: tittel;
`;

const Vedleggoversikt: React.FC<VedleggoversiktProps> = ({ vedleggResponse }) => {
    const { axiosRequest } = useApp();

    const [lastNedDokumentFeilet, settLastNedDokumentFeilet] = useState<string | undefined>(
        undefined
    );
    const lastNedDokument = (vedlegg: VedleggDto) => {
        axiosRequest<string, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/journalpost/${vedlegg.journalpostId}/dokument/${vedlegg.dokumentinfoId}`,
        }).then((res: Ressurs<string>) => {
            switch (res.status) {
                case RessursStatus.SUKSESS:
                    saveAs(res.data, vedlegg.filnavn || vedlegg.tittel);
                    break;
                case RessursStatus.FUNKSJONELL_FEIL:
                case RessursStatus.IKKE_TILGANG:
                case RessursStatus.FEILET:
                    settLastNedDokumentFeilet(res.frontendFeilmelding);
                    break;
                default:
                    break;
            }
        });
    };

    return (
        <>
            {lastNedDokumentFeilet && <AlertStripeFeil>{lastNedDokumentFeilet}</AlertStripeFeil>}
            <DataViewer response={vedleggResponse}>
                {(data: VedleggDto[]) => {
                    return (
                        <>
                            {data.map((vedlegg, indeks) => {
                                return (
                                    <StyledDokument
                                        key={indeks}
                                        role={'button'}
                                        onClick={() => lastNedDokument(vedlegg)}
                                    >
                                        <JournalpostType>
                                            <Journalpostikon
                                                journalposttype={vedlegg.journalposttype}
                                            />
                                        </JournalpostType>
                                        <Vedleggsnavn>{vedlegg.tittel}</Vedleggsnavn>
                                        <StyledDato>{vedlegg.dato}</StyledDato>
                                    </StyledDokument>
                                );
                            })}
                        </>
                    );
                }}
            </DataViewer>
        </>
    );
};

export default Vedleggoversikt;
