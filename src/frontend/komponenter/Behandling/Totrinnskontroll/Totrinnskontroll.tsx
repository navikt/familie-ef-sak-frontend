import * as React from 'react';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { useBehandling } from '../../../context/BehandlingContext';
import { RessursStatus } from '../../../typer/ressurs';
import {
    TotrinnskontrollMedBegrunnelse,
    TotrinnskontrollOpprettet,
    TotrinnskontrollStatus,
} from '../../../typer/totrinnskontroll';
import FatterVedtak from './FatterVedtak';
import styled from 'styled-components';
import Advarsel from '../../../ikoner/Advarsel';
import { formaterIsoDatoTid } from '../../../utils/formatter';
import Info from '../../../ikoner/Info';
import { FC } from 'react';

export const BorderBox = styled.div`
    border: 1px solid #c6c2bf;
    padding: 0.5rem 1rem;
    margin: 1rem 0.5rem;
    border-radius: 0.125rem;

    .ikon-med-tekst {
        display: flex;
        > svg {
            padding-right: 0.25rem;
        }
    }
    > div {
        padding-top: 0.5rem;
    }
`;

const Totrinnskontroll: FC = () => {
    const { behandling, totrinnskontroll } = useBehandling();

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
            return <SendtTilBeslutter totrinnskontroll={totrinnskontroll.data.totrinnskontroll} />;
        case TotrinnskontrollStatus.TOTRINNSKONTROLL_UNDERKJENT:
            return (
                <TotrinnskontrollUnderkjent
                    totrinnskontroll={totrinnskontroll.data.totrinnskontroll}
                />
            );
        case TotrinnskontrollStatus.UAKTUELT:
            return null;
    }
};

export default Totrinnskontroll;

const SendtTilBeslutter: React.FC<{ totrinnskontroll: TotrinnskontrollOpprettet }> = ({
    totrinnskontroll,
}) => {
    return (
        <BorderBox>
            <Undertittel>Totrinnskontroll</Undertittel>
            <div className="ikon-med-tekst">
                <Info heigth={20} width={20} />
                <Element>Vedtaket er sendt til godkjenning</Element>
            </div>
            <div>
                <Normaltekst>{totrinnskontroll.opprettetAv}</Normaltekst>
                <Normaltekst>{formaterIsoDatoTid(totrinnskontroll.opprettetTid)}</Normaltekst>
            </div>
        </BorderBox>
    );
};

const TotrinnskontrollUnderkjent: React.FC<{
    totrinnskontroll: TotrinnskontrollMedBegrunnelse;
}> = ({ totrinnskontroll }) => {
    return (
        <BorderBox>
            <Undertittel>Totrinnskontroll</Undertittel>
            <div className="ikon-med-tekst">
                <Advarsel heigth={20} width={20} />
                <Element>Vedtaket er underkjent</Element>
            </div>
            <div>
                <Normaltekst>{totrinnskontroll.opprettetAv}</Normaltekst>
                <Normaltekst>{formaterIsoDatoTid(totrinnskontroll.opprettetTid)}</Normaltekst>
            </div>
            <div>
                <Element>Begrunnelse:</Element>
                <Normaltekst>{totrinnskontroll.begrunnelse}</Normaltekst>
            </div>
        </BorderBox>
    );
};
