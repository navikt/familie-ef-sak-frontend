import * as React from 'react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import styled from 'styled-components';
import { Steg, stegTypeTilTekst, StegUtfall, stegUtfallTilTekst } from './Steg';
import { Element, Undertekst } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';
import { formaterIsoDatoTid } from '../../../App/utils/formatter';
import hiddenIf from '../../../Felles/HiddenIf/hiddenIf';
import { useBehandling } from '../../../App/context/BehandlingContext';

export interface Behandlingshistorikk {
    behandlingId: string;
    steg: Steg;
    endretAvNavn: string;
    endretAvMail: string;
    endretTid: string;
    utfall?: StegUtfall;
    // eslint-disable-next-line
    metadata?: any;
}

const StyledList = styled.ul`
    padding: 0 0.5rem 1rem 0.5rem;
    margin: 0;
`;

const StyledListElement = styled.li`
    border-bottom: 1px solid ${navFarger.navGra20};
    list-style: none;
    padding: 0.75rem 2rem;

    > :first-child {
        margin-bottom: 0.25rem;
        text-decoration: underline;
    }

    .typo-normal,
    .typo-element {
        color: ${navFarger.navMorkGra};
    }

    .typo-undertekst {
        color: ${navFarger.navGra60};
    }
`;

const renderTittel = (behandlingshistorikk: Behandlingshistorikk): string => {
    if (behandlingshistorikk.steg === Steg.BESLUTTE_VEDTAK && !!behandlingshistorikk.utfall) {
        return stegUtfallTilTekst[behandlingshistorikk.utfall];
    }
    return stegTypeTilTekst[behandlingshistorikk.steg];
};

const BehandlingHistorikk: React.FC = () => {
    const { behandlingHistorikk } = useBehandling();

    return (
        <DataViewer response={{ behandlingHistorikkResponse: behandlingHistorikk }}>
            {({ behandlingHistorikkResponse }) => {
                return (
                    <StyledList>
                        {behandlingHistorikkResponse.map((behandlingshistorikk, idx) => (
                            <StyledListElement key={idx}>
                                <Element>{renderTittel(behandlingshistorikk)}</Element>
                                <Undertekst>
                                    {formaterIsoDatoTid(behandlingshistorikk.endretTid)}
                                </Undertekst>
                                <Undertekst>{behandlingshistorikk.endretAvNavn}</Undertekst>
                                {behandlingshistorikk.metadata?.begrunnelse && (
                                    <Undertekst>
                                        Begrunnelse: {behandlingshistorikk.metadata?.begrunnelse}
                                    </Undertekst>
                                )}
                            </StyledListElement>
                        ))}
                    </StyledList>
                );
            }}
        </DataViewer>
    );
};

export default hiddenIf(BehandlingHistorikk);
