import React, { ReactNode } from 'react';
import { harNoenRessursMedStatus, Ressurs, RessursStatus } from '../../../typer/ressurs';
import SystemetLaster from '../SystemetLaster/SystemetLaster';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

interface DataViewerProps<T> {
    response: Ressurs<T>;
    children: ((data: T) => React.ReactElement) | ReactNode;
}

interface DataViewerProps2<T, U> {
    response: Ressurs<T>;
    response2: Ressurs<U>;
    children: ((data: T, data2: U) => React.ReactElement) | ReactNode;
}

interface DataViewerProps3<T, U, R> {
    response: Ressurs<T>;
    response2: Ressurs<U>;
    response3: Ressurs<R>;
    children: ((data: T, data2: U, data3: R) => React.ReactElement) | ReactNode;
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

const renderChildren = (
    children: (...data: any[]) => React.ReactElement | ReactNode,
    ...data: any[]
) => {
    if (typeof children === 'function') {
        return children(...data);
    }
    return children;
};

function DataViewer<T, U, R>(props: DataViewerProps3<T, U, R>): React.ReactElement;
function DataViewer<T, U>(props: DataViewerProps2<T, U>): React.ReactElement;
function DataViewer<T>(props: DataViewerProps<T>): React.ReactElement;

function DataViewer(props: any) {
    const { response, response2, response3, children } = props;
    const responses = [response, response2, response3].filter((i) => i);
    if (harNoenRessursMedStatus(responses, RessursStatus.FUNKSJONELL_FEIL, RessursStatus.FEILET)) {
        return renderFeil(responses);
    } else if (harNoenRessursMedStatus(responses, RessursStatus.IKKE_TILGANG)) {
        return <AlertStripeFeil children="Ikke tilgang!" />;
    } else if (harNoenRessursMedStatus(responses, RessursStatus.HENTER)) {
        return <SystemetLaster />;
    } else if (harNoenRessursMedStatus(responses, RessursStatus.IKKE_HENTET)) {
        return null;
    } else if (harNoenRessursMedStatus(responses, RessursStatus.SUKSESS)) {
        if (response3) {
            return renderChildren(children, response.data, response2.data, response3.data);
        } else if (response2) {
            return renderChildren(children, response.data, response2.data);
        } else {
            return renderChildren(children, response.data);
        }
    } else {
        return null;
    }
}

export default DataViewer;
