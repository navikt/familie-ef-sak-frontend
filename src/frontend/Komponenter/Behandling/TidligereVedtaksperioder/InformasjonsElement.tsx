import * as React from 'react';
import ToKolonnerLayout from '../../../Felles/Visningskomponenter/ToKolonnerLayout';
import { BodyShort, Heading, Label } from '@navikt/ds-react';
import { BodyShortSmall } from '../../../Felles/Visningskomponenter/Tekster';

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
                venstre: (
                    <Heading size={'medium'} level={'2'}>
                        {tittel}
                    </Heading>
                ),
                høyre: (
                    <>
                        <Label size={'small'} as={'div'} className="blokk-s">
                            {spørsmåltekst}
                            {hjelpetekst && (
                                <BodyShort
                                    size={'small'}
                                    style={{ marginLeft: '0.25rem' }}
                                    as="span"
                                >
                                    {hjelpetekst}
                                </BodyShort>
                            )}
                        </Label>
                        <BodyShortSmall>{spørsmålsvar}</BodyShortSmall>
                    </>
                ),
            }}
        </ToKolonnerLayout>
    );
};

export default InformasjonsElement;
