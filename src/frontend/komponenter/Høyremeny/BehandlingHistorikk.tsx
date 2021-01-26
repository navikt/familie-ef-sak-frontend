import * as React from 'react';
import { useMemo } from 'react';
import { AxiosRequestConfig } from 'axios';
import { Ressurs } from '../../typer/ressurs';
import { useDataHenter } from '../../hooks/felles/useDataHenter';
import DataViewer from '../Felleskomponenter/DataViewer/DataViewer';
import styled from 'styled-components';
import { Steg, stegTypeTilTekst, StegUtfall, stegUtfallTilTekst } from './Steg';
import { Element, Undertekst } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';
import { formaterIsoDatoTid } from '../../utils/formatter';

interface Behandlingshistorikk {
    behandlingId: string;
    steg: Steg;
    endretAvNavn: string;
    endretAvMail: string;
    endretTid: string;
    utfall?: StegUtfall;
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

const BehandlingHistorikk = (props: { behandlingId: string }) => {
    const behandlingshistorikkRequest: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/behandlingshistorikk/${props.behandlingId}`,
        }),
        [props.behandlingId]
    );

    const response: Ressurs<Behandlingshistorikk[]> = useDataHenter<Behandlingshistorikk[], null>(
        behandlingshistorikkRequest
    );

    return (
        <DataViewer response={response}>
            {(data: Behandlingshistorikk[]) => {
                return (
                    <StyledList>
                        {data.map((behandlingshistorikk) => (
                            <StyledListElement>
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

export default BehandlingHistorikk;
