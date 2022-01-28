import React from 'react';
import styled from 'styled-components';
import { Element, Undertekst } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';
import { formaterIsoDatoTidKort } from '../../../App/utils/formatter';
import { hendelseTilHistorikkTekst, HendelseIkon, Hendelse } from './Historikk';
import {
    LinjeProps,
    HistorikkElementProps,
    Behandlingshistorikk,
    StyledHistorikkElementProps,
} from './typer';
import { useApp } from '../../../App/context/AppContext';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { base64toBlob, åpnePdfIEgenTab } from '../../../App/utils/utils';
import LenkeKnapp from '../../../Felles/Knapper/LenkeKnapp';

const IkonMedStipletLinje = styled.div`
    margin-right: 1rem;
`;

const Linje = styled.div`
    margin-right: 13px;
    border-right: 1px dashed #a0a0a0;

    height: ${(props: LinjeProps) =>
        props.siste ? '30px' : props.størreMellomrom ? '75px' : '60px'};
`;

const Innhold = styled.div``;

const StyledHistorikkElement = styled.li`
    display: flex;

    list-style: none;

    padding: ${(props: StyledHistorikkElementProps) =>
        props.første ? '0.75rem 2rem 0' : '0 2rem'};

    .typo-normal,
    .typo-element {
        color: ${navFarger.navMorkGra};
    }

    .typo-undertekst {
        color: ${navFarger.navMorkGra};
    }
`;

const renderTittel = (behandlingshistorikk: Behandlingshistorikk): string => {
    return hendelseTilHistorikkTekst[behandlingshistorikk.hendelse];
};

const HistorikkElement: React.FC<HistorikkElementProps> = ({
    behandlingshistorikk,
    første,
    siste,
    behandlingId,
}) => {
    const { axiosRequest } = useApp();

    const hentOgÅpneVedtaksbrev = () => {
        axiosRequest<string, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/brev/${behandlingId}`,
        }).then((respons: Ressurs<string>) => {
            if (respons.status === RessursStatus.SUKSESS) {
                åpnePdfIEgenTab(base64toBlob(respons.data, 'application/pdf'), 'Vedtaksbrev');
            } else if (
                respons.status === RessursStatus.IKKE_TILGANG ||
                respons.status === RessursStatus.FEILET ||
                respons.status === RessursStatus.FUNKSJONELL_FEIL
            ) {
                console.error(respons.frontendFeilmelding);
            }
        });
    };

    const vedtakIverksatt = behandlingshistorikk.hendelse === Hendelse.VEDTAK_IVERKSATT;

    const harMetadata =
        behandlingshistorikk.metadata?.årsak ||
        behandlingshistorikk.metadata?.begrunnelse ||
        vedtakIverksatt;

    return (
        <StyledHistorikkElement første={første}>
            <IkonMedStipletLinje>
                <HendelseIkon behandlingshistorikk={behandlingshistorikk} />
                <Linje siste={siste} størreMellomrom={harMetadata} />
            </IkonMedStipletLinje>
            <Innhold>
                <Element>{renderTittel(behandlingshistorikk)}</Element>
                <Undertekst>
                    {formaterIsoDatoTidKort(behandlingshistorikk.endretTid)} |{' '}
                    {behandlingshistorikk.endretAvNavn}
                </Undertekst>
                {behandlingshistorikk.metadata?.begrunnelse && (
                    <Undertekst>
                        Begrunnelse: {behandlingshistorikk.metadata?.begrunnelse}
                    </Undertekst>
                )}
                {behandlingshistorikk.metadata?.årsak && (
                    <Undertekst>Årsak: {behandlingshistorikk.metadata?.årsak}</Undertekst>
                )}
                {vedtakIverksatt && (
                    <LenkeKnapp onClick={hentOgÅpneVedtaksbrev}>Vedtaksbrev</LenkeKnapp>
                )}
            </Innhold>
        </StyledHistorikkElement>
    );
};

export default HistorikkElement;
