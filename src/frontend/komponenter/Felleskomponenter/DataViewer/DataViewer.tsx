import React from 'react';
import { harNoenRessursMedStatus, Ressurs, RessursStatus } from '../../../typer/ressurs';
import SystemetLaster from '../SystemetLaster/SystemetLaster';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface DataViewerProps<T> {
    response: Ressurs<T>;
    children: (data: T) => React.ReactElement;
    dependencies?: Ressurs<any>[];
}

const StyledLenke = styled(Link)`
    margin-left: 1rem;
`;

const renderFeil = (responses: Ressurs<any>[]) => (
    <>
        {responses.map((feilet) => {
            if (
                feilet.status === RessursStatus.FUNKSJONELL_FEIL ||
                feilet.status === RessursStatus.FEILET
            ) {
                return <AlertStripeFeil>{feilet.frontendFeilmelding}</AlertStripeFeil>;
            } else {
                return null;
            }
        })}
        <StyledLenke className="lenke" to={{ pathname: '/oppgavebenk' }}>
            Gå til oppgavebenk
        </StyledLenke>
    </>
);

function DataViewer<T>(props: DataViewerProps<T>) {
    const { response, children, dependencies } = props;
    const responses = [...(dependencies ?? []), response];
    if (harNoenRessursMedStatus(responses, RessursStatus.HENTER)) {
        return <SystemetLaster />;
    } else if (harNoenRessursMedStatus(responses, RessursStatus.IKKE_TILGANG)) {
        return <AlertStripeFeil children="Ikke tilgang!" />;
    } else if (
        harNoenRessursMedStatus(responses, RessursStatus.FUNKSJONELL_FEIL, RessursStatus.FEILET)
    ) {
        return renderFeil(responses);
    } else if (harNoenRessursMedStatus(responses, RessursStatus.IKKE_HENTET)) {
        return null;
    } else if (response.status === RessursStatus.SUKSESS) {
        return children(response.data);
    } else {
        return null;
    }
}

export default DataViewer;
