import React from 'react';
import styled from 'styled-components';
import { Rekkefolge } from '../../hooks/useSorteringState';
import classNames from 'classnames';

interface Props {
    tekst: string;
    onClick: () => void;
}

const SorteringsKnapp = styled.button`
    margin-top: 1rem;
`;

const SorteringsHeader: React.FC<Props & WithSortingProps> = ({
    tekst,
    onClick,
    rekkefolge,
    className,
}) => {
    return (
        <th role="columnheader" aria-sort={rekkefolge || 'none'} className={className}>
            <SorteringsKnapp className="lenke" onClick={onClick}>
                {tekst}
            </SorteringsKnapp>
        </th>
    );
};

interface WithSortingProps {
    rekkefolge?: Rekkefolge;
    className?: string;
}

const withSorting = <P extends WithSortingProps>(
    Component: React.ComponentType<P>
): React.FC<P & WithSortingProps> => ({ rekkefolge, className, ...props }: WithSortingProps) => {
    const classNameWithSoring = classNames(className, {
        'tabell__th--sortert-desc': rekkefolge === 'descending',
        'tabell__th--sortert-asc': rekkefolge === 'ascending',
    });
    return <Component {...(props as P)} className={classNameWithSoring} rekkefolge={rekkefolge} />;
};

export default withSorting(SorteringsHeader);
