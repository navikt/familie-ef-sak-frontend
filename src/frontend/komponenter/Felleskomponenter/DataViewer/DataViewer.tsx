import React from 'react';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';
import SystemetLaster from '../SystemetLaster/SystemetLaster';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface DataViewerProps<T> {
    response: Ressurs<T>;
    children: (data: T) => React.ReactElement;
}

const StyledLenke = styled(Link)`
    margin-left: 1rem;
`;

function DataViewer<T>(props: DataViewerProps<T>) {
    const { response, children } = props;
    if (response.status === RessursStatus.HENTER) {
        return <SystemetLaster />;
    } else if (response.status === RessursStatus.IKKE_TILGANG) {
        return <AlertStripeFeil children="Ikke tilgang!" />;
    } else if (
        response.status === RessursStatus.FUNKSJONELL_FEIL ||
        response.status === RessursStatus.FEILET
    ) {
        return (
            <AlertStripeFeil>
                {response.frontendFeilmelding}
                <StyledLenke className="lenke" to={{ pathname: '/oppgavebenk' }}>
                    Gå til oppgavebenk
                </StyledLenke>
            </AlertStripeFeil>
        );
    } else if (response.status === RessursStatus.IKKE_HENTET) {
        return null;
    }

    return children(response.data);
}

export default DataViewer;
