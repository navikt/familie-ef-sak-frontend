import React, { ReactElement, ReactNode } from 'react';
import {
    harNoenRessursMedStatus,
    Ressurs,
    RessursStatus,
    RessursSuksess,
    utledFrontendFeilmelding,
} from '../../App/typer/ressurs';
import SystemetLaster from '../SystemetLaster/SystemetLaster';
import AlertStripeFeilPreWrap, {
    AlertStripeVariant,
} from '../Visningskomponenter/AlertStripeFeilPreWrap';
import { AlertError } from '../Visningskomponenter/Alerts';

/**
 * Input: { behandling: Ressurss<Behandling>, personopslyninger: Ressurss<IPersonopplysninger> }
 * T = {behandling: Behandling, personopslyninger: IPersonoppslysninger}
 * P = behandling, personoppslyninger
 * keyof T = alle nøkkler i T, i dette tilfelle behandling og personoppslyninger
 * T[P] = Behandling og IPersonoppslyninger
 */
interface DataViewerProps<T extends Record<string, unknown>> {
    response: { [P in keyof T]: Ressurs<T[P]> };
    children: ((data: T) => React.ReactElement | null) | ReactNode;
    alertStripeVariant?: AlertStripeVariant;
}

// eslint-disable-next-line
const renderFeil = (responses: Ressurs<any>[], alertOption: AlertStripeVariant) => (
    <>
        {responses.map((feilet, index) => {
            if (
                feilet.status === RessursStatus.FUNKSJONELL_FEIL ||
                feilet.status === RessursStatus.FEILET
            ) {
                return (
                    <AlertStripeFeilPreWrap key={index} alertvariant={alertOption}>
                        {feilet.frontendFeilmelding}
                    </AlertStripeFeilPreWrap>
                );
            } else {
                return null;
            }
        })}
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
    const { response, children, alertStripeVariant } = props;
    const responses = Object.values(response);
    if (harNoenRessursMedStatus(responses, RessursStatus.IKKE_TILGANG)) {
        return (
            <AlertError>
                <div>Ikke tilgang.</div>
                <div>{utledFrontendFeilmelding(responses)}</div>
            </AlertError>
        );
    } else if (
        harNoenRessursMedStatus(responses, RessursStatus.FUNKSJONELL_FEIL, RessursStatus.FEILET)
    ) {
        return renderFeil(
            responses,
            alertStripeVariant ? alertStripeVariant : AlertStripeVariant.IKKE_VALGT
        );
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
