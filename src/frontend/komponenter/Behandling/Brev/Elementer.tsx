import styled from 'styled-components';
import { Document } from 'react-pdf';
import Pagination from 'paginering';
import { Knapp } from 'nav-frontend-knapper';

export const GenererBrev = styled(Knapp)`
    display: block;
    margin: 0 auto;
`;

export const StyledPagination = styled(Pagination)`
    margin: 0 auto;
`;

export const StyledBrev = styled.div`
    background-color: #f2f2f2;
    padding: 3rem;
`;

export const StyledDokument = styled(Document)`
    .react-pdf__Page__canvas {
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

        margin: 0 auto;

        margin-top: 3rem;
        margin-bottom: 3rem;
    }
`;

export const DokumentWrapper = styled.div`
    display: flex;
    flex-direction: column;

    margin-top: 3rem;
`;
