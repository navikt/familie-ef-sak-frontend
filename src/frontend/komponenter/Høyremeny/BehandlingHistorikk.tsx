import * as React from 'react';
import { useMemo } from 'react';
import { AxiosRequestConfig } from 'axios';
import { Ressurs } from '../../typer/ressurs';
import { useDataHenter } from '../../hooks/felles/useDataHenter';
import DataViewer from '../Felleskomponenter/DataViewer/DataViewer';
import styled from 'styled-components';
import { Steg, stegTypeTilTekst } from './Steg';
import compareDesc from 'date-fns/compareDesc';
import { Element, Normaltekst, Undertekst } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';
import { formaterIsoDato } from '../../utils/formatter';
import { useBehandling } from '../../context/BehandlingContext';

interface BehandlingHistorikkProps {
    behandlingId: string;
    steg: Steg;
    endretAvNavn: string;
    endretAvMail: string;
    endretTid: string;
}

const StyledList = styled.ul`
    padding: 0 0.5rem 1rem 0.5rem;
    margin: 0;
`;

const StyledListElement = styled.li`
    border-bottom: 1px solid ${navFarger.navGra20};
    list-style: none;
    padding: 0 2rem;

    > :first-child {
        margin-top: 1rem;
    }
    > * {
        margin-bottom: 0.5rem;
    }

    .typo-normal,
    .typo-element {
        color: ${navFarger.navMorkGra};
    }

    .typo-undertekst {
        color: ${navFarger.navGra60};
    }
`;

const BehandlingHistorikk = (props: { behandlingId: string }) => {
    const { stateKey } = useBehandling();
    const behandlingHistorikkLogg: AxiosRequestConfig = useMemo(
        () => ({
            method: 'GET',
            url: `/familie-ef-sak/api/behandlinghistorikk/${props.behandlingId}`,
        }),
        [props.behandlingId, stateKey]
    );

    const behandlingHistorikk: Ressurs<BehandlingHistorikkProps[]> = useDataHenter<
        BehandlingHistorikkProps[],
        null
    >(behandlingHistorikkLogg);

    return (
        <DataViewer response={behandlingHistorikk}>
            {(data: BehandlingHistorikkProps[]) => {
                return (
                    <StyledList>
                        {data
                            .sort((a, b) =>
                                compareDesc(new Date(a.endretTid), new Date(b.endretTid))
                            )
                            .map((v) => (
                                <StyledListElement>
                                    <Element>{stegTypeTilTekst[v.steg]}</Element>
                                    <Normaltekst>{v.endretAvNavn}</Normaltekst>
                                    <Undertekst>{formaterIsoDato(v.endretTid)}</Undertekst>
                                </StyledListElement>
                            ))}
                    </StyledList>
                );
            }}
        </DataViewer>
    );
};

export default BehandlingHistorikk;
