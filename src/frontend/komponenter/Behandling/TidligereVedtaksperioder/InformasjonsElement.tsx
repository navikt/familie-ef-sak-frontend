import * as React from 'react';
import { Element, Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import ToKolonnerLayout from '../../Felleskomponenter/ToKolonnerLayout';

interface Props {
    tittel: string;
    spørsmåltekst: string;
    spørsmålsvar: string;
    hjelpetekst?: string;
}

const InformasjonsElement: React.FC<Props> = ({
    tittel,
    spørsmålsvar,
    spørsmåltekst,
    hjelpetekst,
}) => {
    return (
        <ToKolonnerLayout skillelinje={false}>
            {{
                venstre: <Systemtittel>{tittel}</Systemtittel>,
                høyre: (
                    <>
                        <Element className="blokk-s">
                            {spørsmåltekst}
                            {hjelpetekst && (
                                <Normaltekst
                                    style={{ marginLeft: '0.25rem' }}
                                    tag="span"
                                    children={hjelpetekst}
                                />
                            )}
                        </Element>
                        <Normaltekst>{spørsmålsvar}</Normaltekst>
                    </>
                ),
            }}
        </ToKolonnerLayout>
    );
};

export default InformasjonsElement;
