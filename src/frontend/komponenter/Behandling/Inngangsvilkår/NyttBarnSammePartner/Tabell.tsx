import React from 'react';
import styled from 'styled-components';
import { Normaltekst } from 'nav-frontend-typografi';
import navFarger from 'nav-frontend-core';

interface Props<T> {
    data: T[];
    kolonner: {
        overskrift: string;
        tekstVerdi: (data: T) => React.ReactNode;
    }[];
    onEmpty: string;
}

const StyledTable = styled.table`
    width: 100%;
    td,
    th {
        display: table-cell;
        padding: 0.5rem;
        border-bottom: none;
        text-align: unset;
    }
`;

const StyledNormalTekst = styled(Normaltekst)`
    color: ${navFarger.navGra60};
    margin-left: 1.5rem;
    margin-top: 1.5rem;
`;

export function Tabell<T>({ data, kolonner, onEmpty }: Props<T>): React.ReactElement {
    return (
        <div className="blokk-xs">
            <StyledTable>
                <thead>
                    <tr>
                        {kolonner.map((kolonne) => (
                            <th key={kolonne.overskrift}>{kolonne.overskrift}</th>
                        ))}
                    </tr>
                </thead>
                {data.length > 0 && (
                    <tbody>
                        {data.map((item, index) => {
                            return (
                                <tr key={index}>
                                    {kolonner.map((kolonne, index) => (
                                        <td key={index}>{kolonne.tekstVerdi(item) || ''}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                )}
            </StyledTable>
            {data.length === 0 && <StyledNormalTekst>{onEmpty}</StyledNormalTekst>}
        </div>
    );
}
