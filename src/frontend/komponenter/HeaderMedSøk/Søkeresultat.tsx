import React from 'react';
import styled from 'styled-components';
import { Element } from 'nav-frontend-typografi';
import { FamilieIkonVelger } from '@navikt/familie-ikoner';
import { kjønnType } from '@navikt/familie-typer';
import { Folkeregisterpersonstatus } from '../../typer/saksøk';
import PersonStatusVarsel from '../Felleskomponenter/PersonStatusVarsel';
import { styles } from '../../typer/styles';

const StyledResultat = styled.div`
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
        <StyledResultat onClick={onClick} role={'button'}>
            <FamilieIkonVelger className={'familie-ikon-velger'} alder={alder} kjønn={kjønn} />
            <ElementTekst>
                {navn} ({ident})
            </ElementTekst>
            {folkeregisterpersonstatus && (
                <PersonStatusWrapper>
                    <PersonStatusVarsel folkeregisterpersonstatus={folkeregisterpersonstatus} />
                </PersonStatusWrapper>
            )}
        </StyledResultat>
    );
};

export default Søkeresultat;
