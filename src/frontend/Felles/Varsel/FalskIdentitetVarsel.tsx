import React from 'react';
import { Alert, BodyShort, Heading } from '@navikt/ds-react';
import { IFalskIdentitet } from '../../App/typer/personopplysninger';

interface Props {
    falskIdentitet: IFalskIdentitet;
}

const FalskIdentitetVarsel: React.FC<Props> = ({ falskIdentitet }) => (
    <Alert variant={'error'} size={'small'}>
        <Heading size={'xsmall'} level={'2'}>
            Folkeregisteret har merket identen som falsk
        </Heading>
        <BodyShort size={'small'}>
            Opplysningene om personen kan være feil eller mangle.
            {falskIdentitet.rettIdentitetErUkjent &&
                ' Folkeregisteret vet ikke hvem den rette personen er.'}
        </BodyShort>
    </Alert>
);

export default FalskIdentitetVarsel;
