import React from 'react';
import styled from 'styled-components';
import { Element } from 'nav-frontend-typografi';
import { FamilieIkonVelger } from '@navikt/familie-ikoner';
import { kjønnType } from '@navikt/familie-typer';
import './søkeresultat.less';
import navFarger from 'nav-frontend-core';
import { styles } from '../../typer/styles';

const InlineWrapper = styled.div`
    display: flex;
`;

const ResultatWrapper = styled.div`
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
    navn: string;
    ident: string;
    kjønn: kjønnType;
    onClick: () => void;
}

const Søkeresultat: React.FC<IProps> = ({ alder, navn, ident, kjønn, onClick }) => {
    return (
        <ResultatWrapper onClick={onClick} role={'button'}>
            <InlineWrapper>
                <div>
                    <FamilieIkonVelger
                        className={'familie-ikon-velger'}
                        alder={alder}
                        kjønn={kjønn}
                    />
                </div>
                <ElementTekst>
                    {navn} ({ident})
                </ElementTekst>
            </InlineWrapper>
        </ResultatWrapper>
    );
};

export default Søkeresultat;
