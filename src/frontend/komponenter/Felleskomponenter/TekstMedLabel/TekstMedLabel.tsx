import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';

interface Props {
    label: string;
    tekst: string;
}

const TekstMedLabel = ({ label, tekst }: Props): JSX.Element => {
    return (
        <div style={{ marginRight: '2rem' }} className="skjemaelement">
            <span className="skjemaelement__label">{label}</span>
            <Normaltekst style={{ marginTop: '1rem' }}>{tekst}</Normaltekst>
        </div>
    );
};

export default TekstMedLabel;
