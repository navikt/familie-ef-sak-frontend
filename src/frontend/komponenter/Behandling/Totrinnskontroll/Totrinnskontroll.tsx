import * as React from 'react';
import { FC, useEffect, useState } from 'react';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { useBehandling } from '../../../context/BehandlingContext';
import { byggFeiletRessurs, byggTomRessurs, Ressurs, RessursStatus } from '../../../typer/ressurs';
import {
    Totrinnskontroll,
    TotrinnskontrollStatus,
    TotrinnskontrollUnderkjennelse,
} from '../../../typer/totrinnskontroll';
import { useApp } from '../../../context/AppContext';
import FatterVedtak from './FatterVedtak';
import styled from 'styled-components';
import Advarsel from '../../../ikoner/Advarsel';
import { formaterIsoDatoTid } from '../../../utils/formatter';

export const BorderBox = styled.div`
    border: 1px solid #c6c2bf;
    padding: 0.5rem 1rem;
    margin: 1rem 0.5rem;
    border-radius: 0.125rem;
    > div {
        padding-top: 0.5rem;
    }
`;

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
        case TotrinnskontrollStatus.KAN_FATTE_VEDTAK:
            return <FatterVedtak behandlingId={behandling.data.id} />;
        case TotrinnskontrollStatus.IKKE_AUTORISERT:
            return <SendtTilBeslutter />;
        case TotrinnskontrollStatus.TOTRINNSKONTROLL_UNDERKJENT:
            return (
                <TotrinnskontrollUnderkjent underkjennelse={totrinnskontroll.data.underkjennelse} />
            );
        case TotrinnskontrollStatus.UAKTUELT:
            return null;
    }
};

export default Totrinnskontroll;

const SendtTilBeslutter = () => {
    return (
        <div>
            <Undertittel>Totrinnskontroll</Undertittel>
            <Element>Sendt Til Beslutter</Element>
        </div>
    );
};

const TotrinnskontrollUnderkjent: React.FC<{ underkjennelse?: TotrinnskontrollUnderkjennelse }> = ({
    underkjennelse,
}) => {
    if (!underkjennelse) {
        return null;
    }
    return (
        <BorderBox>
            <Undertittel>Totrinnskontroll</Undertittel>
            <div style={{ display: 'flex' }}>
                <Advarsel heigth={20} width={20} />
                <Element>Vedtaket er underkjent</Element>
            </div>
            <div>
                <Normaltekst>{underkjennelse.besluttetAv}</Normaltekst>
                <Normaltekst>{formaterIsoDatoTid(underkjennelse.besluttetTid)}</Normaltekst>
            </div>
            <div>
                <Element style={{ marginTop: '0.25rem' }}>Begrunnelse:</Element>
                <Normaltekst>{underkjennelse.begrunnelse}</Normaltekst>
            </div>
        </BorderBox>
    );
};
