import React from 'react';
import { Normaltekst } from 'nav-frontend-typografi';

interface Props {
    label: string;
    tekst: string;
}

const TekstMedLabel: React.FC<Props> = ({ label, tekst }: Props) => {
    return (
        <div style={{ marginRight: '2rem' }} className="skjemaelement">
            <span className="skjemaelement__label">{label}</span>
            <Normaltekst style={{ marginTop: '1rem' }}>{tekst}</Normaltekst>
        </div>
    );
};

export default TekstMedLabel;
