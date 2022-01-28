import React from 'react';
import styled from 'styled-components';
import { Element, Undertekst } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';
import { formaterIsoDatoTidKort } from '../../../App/utils/formatter';
import { hendelseTilHistorikkTekst, HendelseIkon } from './Historikk';
import {
    LinjeProps,
    HistorikkElementProps,
    Behandlingshistorikk,
    StyledHistorikkElementProps,
} from './typer';

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
}) => {
    const harMetadata =
        behandlingshistorikk.metadata?.årsak || behandlingshistorikk.metadata?.begrunnelse;

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
            </Innhold>
        </StyledHistorikkElement>
    );
};

export default HistorikkElement;
