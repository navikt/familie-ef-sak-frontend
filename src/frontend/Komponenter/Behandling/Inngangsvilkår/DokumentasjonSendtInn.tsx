import React, { FC } from 'react';
import { IDokumentasjon } from '../../../App/typer/felles';
import { Alert, BodyLong, Heading } from '@navikt/ds-react';

interface Props {
    tittel: string;
    dokumentasjon?: IDokumentasjon;
}

const DokumentasjonSendtInn: FC<Props> = ({ tittel, dokumentasjon }) => {
    return (
        dokumentasjon &&
        dokumentasjon.harSendtInn && (
            <Alert variant={'info'} size={'small'}>
                <Heading size={'xsmall'} level={'4'}>
                    {tittel}
                </Heading>
                <BodyLong size={'small'}>
                    Bruker har i søknad krysset av for at dokumentasjonen er sendt inn til NAV
                    tidligere
                </BodyLong>
            </Alert>
        )
    );
};
export default DokumentasjonSendtInn;
