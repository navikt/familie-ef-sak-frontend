import React from 'react';
import styled from 'styled-components';
import classNames from 'classnames';
import { Rekkefolge } from '../../hooks/useSorteringState';

interface Props {
    rekkefolge: Rekkefolge;
    tekst: string;
    onClick: () => void;
}

const SorteringsKnapp = styled.button`
    margin-top: 1rem;
`;

const OppgaveSorteringsHeader: React.FC<Props> = ({ rekkefolge, tekst, onClick }) => {
    return (
        <th
            role="columnheader"
            aria-sort="descending"
            className={classNames({
                'tabell__th--sortert-desc': rekkefolge === 'descending',
                'tabell__th--sortert-asc': rekkefolge === 'ascending',
            })}
        >
            <SorteringsKnapp className="lenke" onClick={onClick}>
                {tekst}
            </SorteringsKnapp>
        </th>
    );
};

export default OppgaveSorteringsHeader;
