import React from 'react';
import styled from 'styled-components';
import { Element } from 'nav-frontend-typografi';
import { FamilieIkonVelger } from '@navikt/familie-ikoner';
import { kjønnType } from '@navikt/familie-typer';
import { Folkeregisterpersonstatus } from '../../typer/saksøk';
import PersonStatusVarsel from '../Felleskomponenter/PersonStatusVarsel';
import { styles } from '../../typer/styles';
import './søkeresultat.less';
const InlineWrapper = styled.div`
    display: flex;
`;

const ResultatWrapper = styled.div`
    background-color: ${styles.farger.navMorkGra};
    padding: 10px;
    display: flex;
    flex-flow: wrap;
`;

const ElementTekst = styled(Element)`
    color: ${styles.farger.hvit};
`;

const PersonStatusWrapper = styled.div`
    margin-left: 2rem;
`;

interface IProps {
    alder: number;
    navn: string;
    ident: string;
    kjønn: kjønnType;
    folkeregisterpersonstatus?: Folkeregisterpersonstatus;
    onClick: () => void;
}

const Søkeresultat: React.FC<IProps> = ({
    alder,
    navn,
    ident,
    kjønn,
    folkeregisterpersonstatus,
    onClick,
}) => {
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

            {folkeregisterpersonstatus && (
                <PersonStatusWrapper>
                    <PersonStatusVarsel folkeregisterpersonstatus={folkeregisterpersonstatus} />
                </PersonStatusWrapper>
            )}
        </ResultatWrapper>
    );
};

export default Søkeresultat;
