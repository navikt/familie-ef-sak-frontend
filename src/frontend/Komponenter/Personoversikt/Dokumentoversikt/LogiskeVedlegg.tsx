import React from 'react';
import { LogiskVedlegg } from '../../../App/typer/dokumentliste';

interface Props {
    logiskeVedlegg: LogiskVedlegg[];
}

export const LogiskeVedlegg: React.FC<Props> = ({ logiskeVedlegg }) => {
    return (
        <>
            {logiskeVedlegg.map((logiskVedlegg, index) => (
                <div key={`${logiskVedlegg.tittel}${index}`}>{logiskVedlegg.tittel}</div>
            ))}
        </>
    );
};
