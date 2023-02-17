import React from 'react';
import { Ressurs } from '../../App/typer/ressurs';
import DataViewer from '../../Felles/DataViewer/DataViewer';

interface Props {
    pdfFilInnhold: Ressurs<string>;
}

const IframeDokument: React.FC<Props> = ({ pdfFilInnhold }) => {
    return (
        <DataViewer response={{ pdfFilInnhold }}>
            {({ pdfFilInnhold }) => (
                <iframe
                    title={'dokument'}
                    src={`data:application/pdf;base64,${pdfFilInnhold}`}
                    width={'100%'}
                    height={'100%'}
                />
            )}
        </DataViewer>
    );
};

export default IframeDokument;
