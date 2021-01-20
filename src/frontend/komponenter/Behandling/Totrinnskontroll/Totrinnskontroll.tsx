import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { Element, Undertittel } from 'nav-frontend-typografi';
import { useBehandling } from '../../../context/BehandlingContext';
import { byggFeiletRessurs, byggTomRessurs, Ressurs, RessursStatus } from '../../../typer/ressurs';
import { Totrinnskontroll, TotrinnskontrollStatus } from '../../../typer/totrinnskontroll';
import { useApp } from '../../../context/AppContext';

const Totrinnskontroll: FC = () => {
    const { behandling } = useBehandling();
    const { axiosRequest } = useApp();

    const [totrinnskontroll, settTotrinnskontroll] = useState<Ressurs<Totrinnskontroll>>(
        byggTomRessurs()
    );

    useEffect(() => {
        if (behandling.status === RessursStatus.SUKSESS) {
            axiosRequest<Totrinnskontroll, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/vedtak/${behandling.data.id}/totrinnskontroll`,
            })
                .then((response: Ressurs<Totrinnskontroll>) => {
                    settTotrinnskontroll(response);
                })
                .catch((error) =>
                    settTotrinnskontroll(
                        byggFeiletRessurs(
                            'En ukjent feil oppsto ved henting av totrinnskontroll',
                            error
                        )
                    )
                );
        }
    }, [behandling.status]);

    if (
        behandling.status !== RessursStatus.SUKSESS ||
        totrinnskontroll.status !== RessursStatus.SUKSESS
    ) {
        return null;
    }

    switch (totrinnskontroll.data.status) {
        case TotrinnskontrollStatus.FATTAR_VEDTAK:
            return <FattarVedtak />;
        case TotrinnskontrollStatus.SENDT_TIL_BESLUTTER:
            return <SendtTilBeslutter />;
        case TotrinnskontrollStatus.TOTRINNSKONTROLL_UNDERKJENT:
            return <TotrinnskontrollUnderkjent />;
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
