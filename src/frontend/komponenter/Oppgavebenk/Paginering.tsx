import React from 'react';
import styled from 'styled-components';
import NavFrontendChevron from 'nav-frontend-chevron';

const StyledDiv = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: flex-end;
`;

const PagineringKnapp = styled.button`
    margin: 0 1px;
    position: relative;
    padding: 0.25rem 0rem;
    1px solid transparent;
`;

interface Props {
    sideStorrelse: number;
    antallTotalt: number;
    valgtSide: number;
    settValgtSide: (side: number) => void;
}

const Paginering: React.FC<Props> = ({ sideStorrelse, antallTotalt, valgtSide, settValgtSide }) => {
    const antallSider: number = Math.ceil(antallTotalt / sideStorrelse);
    const erPaForsteSide: boolean = valgtSide === 1;
    const erPaSisteSide: boolean = valgtSide === antallSider;

    return (
        <StyledDiv>
            <PagineringKnapp disabled={erPaForsteSide} onClick={() => settValgtSide(valgtSide - 1)}>
                <NavFrontendChevron type="venstre" />
            </PagineringKnapp>
            <PagineringKnapp onClick={() => settValgtSide(1)}>1</PagineringKnapp>
            {!erPaForsteSide && <PagineringKnapp>{valgtSide}</PagineringKnapp>}
            {antallSider > 1 && (
                <PagineringKnapp onClick={() => settValgtSide(antallSider)}>
                    {antallSider}
                </PagineringKnapp>
            )}
            <PagineringKnapp disabled={erPaSisteSide} onClick={() => settValgtSide(valgtSide + 1)}>
                <NavFrontendChevron type="høyre" />
            </PagineringKnapp>
        </StyledDiv>
    );
};

export default Paginering;
