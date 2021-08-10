import React, { ReactElement, ReactNode } from 'react';
import {
    harNoenRessursMedStatus,
    Ressurs,
    RessursStatus,
    RessursSuksess,
} from '../../App/typer/ressurs';
import SystemetLaster from '../SystemetLaster/SystemetLaster';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AlertStripeFeilPreWrap from '../Visningskomponenter/AlertStripeFeilPreWrap';

/**
 * Input: { behandling: Ressurss<Behandling>, personopslyninger: Ressurss<IPersonopplysninger> }
 * T = {behandling: Behandling, personopslyninger: IPersonoppslysninger}
 * P = behandling, personoppslyninger
 * keyof T = alle nøkkler i T, i dette tilfelle behandling og personoppslyninger
 * T[P] = Behandling og IPersonoppslyninger
 */
interface DataViewerProps<T extends Record<string, unknown>> {
    response: { [P in keyof T]: Ressurs<T[P]> };
    children: ((data: T) => React.ReactElement) | ReactNode;
}

const StyledLenke = styled(Link)`
    margin-left: 1rem;
`;

// eslint-disable-next-line
const renderFeil = (responses: Ressurs<any>[]) => (
    <>
        {responses.map((feilet, index) => {
            if (
                feilet.status === RessursStatus.FUNKSJONELL_FEIL ||
                feilet.status === RessursStatus.FEILET
            ) {
                return (
                    <AlertStripeFeilPreWrap key={index}>
                        {feilet.frontendFeilmelding}
                    </AlertStripeFeilPreWrap>
                );
            } else {
                return null;
            }
        })}
        <StyledLenke className="lenke" to={{ pathname: '/oppgavebenk' }}>
            Gå til oppgavebenk
        </StyledLenke>
    </>
);

// eslint-disable-next-line
const renderChildren = (children: any, response: any): ReactElement => {
    if (typeof children === 'function') {
        const data = Object.keys(response).reduce((acc: Record<string, unknown>, key) => {
            // eslint-disable-next-line
            acc[key] = (response[key] as RessursSuksess<any>).data;
            return acc;
        }, {});
        return children(data);
    }
    return children;
};

function DataViewer<T extends Record<string, unknown>>(
    props: DataViewerProps<T>
): JSX.Element | null {
    const { response, children } = props;
    const responses = Object.values(response);
    if (harNoenRessursMedStatus(responses, RessursStatus.FUNKSJONELL_FEIL, RessursStatus.FEILET)) {
        return renderFeil(responses);
    } else if (harNoenRessursMedStatus(responses, RessursStatus.IKKE_TILGANG)) {
        return <AlertStripeFeil children="Ikke tilgang!" />;
    } else if (harNoenRessursMedStatus(responses, RessursStatus.HENTER)) {
        return <SystemetLaster />;
    } else if (harNoenRessursMedStatus(responses, RessursStatus.IKKE_HENTET)) {
        return null;
    } else if (responses.every((response) => response.status === RessursStatus.SUKSESS)) {
        return renderChildren(children, response);
    } else {
        return null;
    }
}

export default DataViewer;
