import React from 'react';
import styled from 'styled-components';
import { Element } from 'nav-frontend-typografi';
import './søkeresultat.less';
import navFarger from 'nav-frontend-core';
import { styles } from '../../typer/styles';

const InlineWrapper = styled.div`
    display: flex;
`;

const ResultatButton = styled.div`
    background-color: ${navFarger.navMorkGra};
    padding: 10px;
    display: flex;
    flex-flow: wrap;
`;

const ElementTekst = styled(Element)`
    color: ${styles.farger.hvit};
`;

interface IProps {
    alder: number;
    navn?: string;
    ident: string;
}

const Søkeresultat: React.FC<IProps> = ({ navn, ident }) => {
    return (
        <ResultatButton>
            <InlineWrapper>
                <ElementTekst>
                    {navn} ({ident})
                </ElementTekst>
            </InlineWrapper>
        </ResultatButton>
    );
};

export default Søkeresultat;
