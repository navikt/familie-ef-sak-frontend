import React from 'react';
import styled from 'styled-components';
import navFarger from 'nav-frontend-core';
import { BodyShortSmall, SmallTextLabel } from '../../../../Felles/Visningskomponenter/Tekster';

interface Props<T> {
    data: T[];
    kolonner: {
        overskrift: string | React.ReactNode;
        tekstVerdi: (data: T) => React.ReactNode;
    }[];
    onEmpty?: string;
}

const StyledTable = styled.table`
    thead {
        display: table-header-group;
    }
    td,
    th {
        padding: 0.25rem 1.5rem;
        border-bottom: none;
        text-align: unset;
    }
`;

const IngenDataContainer = styled.div`
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
                        {kolonner.map((kolonne, index) => (
                            <th key={index}>
                                <SmallTextLabel>{kolonne.overskrift}</SmallTextLabel>
                            </th>
                        ))}
                    </tr>
                </thead>
                {data.length > 0 && (
                    <tbody>
                        {data.map((item, index) => {
                            return (
                                <tr key={index}>
                                    {kolonner.map((kolonne, index) => (
                                        <td key={index}>
                                            <BodyShortSmall>
                                                {kolonne.tekstVerdi(item) || ''}
                                            </BodyShortSmall>
                                        </td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                )}
            </StyledTable>
            {data.length === 0 && onEmpty && (
                <IngenDataContainer>
                    <BodyShortSmall>{onEmpty}</BodyShortSmall>
                </IngenDataContainer>
            )}
        </div>
    );
}
