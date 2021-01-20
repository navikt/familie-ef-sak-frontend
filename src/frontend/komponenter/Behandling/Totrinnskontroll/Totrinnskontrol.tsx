import * as React from 'react';
import { FC } from 'react';
import { Element, Undertittel } from 'nav-frontend-typografi';

export enum TotrinnskontrollStatus {
    SENDT_TIL_BESLUTTER = 'SENDT_TIL_BESLUTTER',
    TOTRINNSKONTROLL_UNDERKJENT = 'TOTRINNSKONTROLL_UNDERKJENT',
    FATTAR_VEDTAK = 'FATTAR_VEDTAK',
}

const Totrinnskontroll: FC<{ totrinnskontrollStatus: TotrinnskontrollStatus }> = ({
    totrinnskontrollStatus,
}) => {
    switch (totrinnskontrollStatus) {
        case TotrinnskontrollStatus.FATTAR_VEDTAK:
            return <FattarVedtak />;
        case TotrinnskontrollStatus.SENDT_TIL_BESLUTTER:
            return <SendtTilBeslutter />;
        case TotrinnskontrollStatus.TOTRINNSKONTROLL_UNDERKJENT:
            return <TotrinnskontrollUnderkjent />;
        default:
            return null;
    }
};

export default Totrinnskontroll;

const SendtTilBeslutter = () => {
    return (
        <div>
            <Undertittel>To-trinnskontroll</Undertittel>
            <Element>Sendt Til Beslutter</Element>
        </div>
    );
};

const FattarVedtak = () => {
    return (
        <div>
            <Undertittel>To-trinnskontroll</Undertittel>
            <Element>Tryck på noe</Element>
        </div>
    );
};

const TotrinnskontrollUnderkjent = () => {
    return (
        <div>
            <Undertittel>To-trinnskontroll</Undertittel>
            <Element>Tryck på noe</Element>
        </div>
    );
};
