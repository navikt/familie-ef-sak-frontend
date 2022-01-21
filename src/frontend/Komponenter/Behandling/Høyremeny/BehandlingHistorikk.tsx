import * as React from 'react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import { Steg, StegUtfall } from './Steg';
import { Element, Undertekst } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';
import { formaterIsoDatoTidKort } from '../../../App/utils/formatter';
import hiddenIf from '../../../Felles/HiddenIf/hiddenIf';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Hendelse, hendelseTilHistorikkTekst, HendelseIkon } from './Historikk';

export interface Behandlingshistorikk {
    behandlingId: string;
    steg: Steg;
    hendelse: Hendelse;
    endretAvNavn: string;
    endretAvMail: string;
    endretTid: string;
    utfall?: StegUtfall;
    // eslint-disable-next-line
    metadata?: any;
}

interface StyledListElementProps {
    første: boolean;
}

interface LinjeProps {
    siste: boolean;
}

const IkonMedStipletLinje = styled.div`
    margin-right: 1rem;
`;

const Linje = styled.div`
    margin-right: 13px;
    border-right: 1px dashed #a0a0a0;
    height: 60px;

    height: ${(props: LinjeProps) => (props.siste ? '30px' : '60px')};
`;

const Innhold = styled.div``;

const StyledList = styled.ul`
    padding: 0 0.5rem 2rem 0.5rem;
    margin: 0;
`;

const StyledListElement = styled.li`
    display: flex;

    list-style: none;

    padding: ${(props: StyledListElementProps) => (props.første ? '0.75rem 2rem 0' : '0 2rem')};

    .typo-normal,
    .typo-element {
        color: ${navFarger.navMorkGra};
    }

    .typo-undertekst {
        color: ${navFarger.navGra60};
    }
`;

const renderTittel = (behandlingshistorikk: Behandlingshistorikk): string => {
    return hendelseTilHistorikkTekst[behandlingshistorikk.hendelse];
};

const BehandlingHistorikk: React.FC = () => {
    const { behandlingHistorikk } = useBehandling();

    return (
        <DataViewer response={{ behandlingHistorikkResponse: behandlingHistorikk }}>
            {({ behandlingHistorikkResponse }) => {
                return (
                    <StyledList>
                        {behandlingHistorikkResponse.map((behandlingshistorikk, idx) => {
                            const første = idx === 0;
                            const siste = idx === behandlingHistorikkResponse.length - 1;

                            return (
                                <StyledListElement første={første} key={idx}>
                                    <IkonMedStipletLinje>
                                        <HendelseIkon behandlingshistorikk={behandlingshistorikk} />
                                        <Linje siste={siste} />
                                    </IkonMedStipletLinje>
                                    <Innhold>
                                        <Element>{renderTittel(behandlingshistorikk)}</Element>
                                        <Undertekst>
                                            {formaterIsoDatoTidKort(behandlingshistorikk.endretTid)}{' '}
                                            {behandlingshistorikk.endretAvNavn}
                                        </Undertekst>
                                        {behandlingshistorikk.metadata?.begrunnelse && (
                                            <Undertekst>
                                                Begrunnelse:{' '}
                                                {behandlingshistorikk.metadata?.begrunnelse}
                                            </Undertekst>
                                        )}
                                        {behandlingshistorikk.metadata?.årsak && (
                                            <Undertekst>
                                                Årsak: {behandlingshistorikk.metadata?.årsak}
                                            </Undertekst>
                                        )}
                                    </Innhold>
                                </StyledListElement>
                            );
                        })}
                    </StyledList>
                );
            }}
        </DataViewer>
    );
};

export default hiddenIf(BehandlingHistorikk);
