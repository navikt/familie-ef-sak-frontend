import React from 'react';
import { Ressurs, RessursStatus } from '../../../typer/ressurs';
import SystemetLaster from '../SystemetLaster/SystemetLaster';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';

interface DataViewerProps<T> {
    response: Ressurs<T>;
    children: (data: T) => React.ReactElement;
}

function DataViewer<T>(props: DataViewerProps<T>) {
    const { response, children } = props;
    if (response.status === RessursStatus.HENTER) {
        return <SystemetLaster />;
    } else if (response.status === RessursStatus.IKKE_TILGANG) {
        return <AlertStripeFeil children="Ikke tilgang!" />;
    } else if (response.status === RessursStatus.FEILET) {
        return <AlertStripeFeil children="Noe gikk galt" />;
    } else if (response.status === RessursStatus.IKKE_HENTET) {
        return null;
    }

    return children(response.data);
}

export default DataViewer;
