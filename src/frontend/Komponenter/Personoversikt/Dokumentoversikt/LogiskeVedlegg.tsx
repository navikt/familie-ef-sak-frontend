import React from 'react';
import { ILogiskVedlegg } from '../../../App/typer/dokumentliste';
import styled from 'styled-components';

const DivMedVenstreMargin = styled.div`
    margin-left: 2rem;
`;

export const LogiskeVedlegg: React.FC<{ logiskeVedlegg: ILogiskVedlegg[] }> = ({
    logiskeVedlegg,
}) => {
    return (
        <>
            {logiskeVedlegg.map((logiskVedlegg, index) => (
                <DivMedVenstreMargin key={`${logiskVedlegg.tittel}${index}`}>
                    {logiskVedlegg.tittel}
                </DivMedVenstreMargin>
            ))}
        </>
    );
};
