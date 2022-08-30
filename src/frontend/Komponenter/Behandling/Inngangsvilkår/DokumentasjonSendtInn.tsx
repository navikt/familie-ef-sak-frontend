import React, { FC } from 'react';
import { IDokumentasjon } from '../../../App/typer/felles';
import { Alert, BodyLong, Heading } from '@navikt/ds-react';
import styled from 'styled-components';

interface Props {
    tittel: string;
    dokumentasjon?: IDokumentasjon;
}

const DokumentasjonSendtInnWrapper = styled.div`
    margin-bottom: 1rem;
`;

const DokumentasjonSendtInn: FC<Props> = ({ tittel, dokumentasjon }) => {
    return dokumentasjon && dokumentasjon.harSendtInn ? (
        <DokumentasjonSendtInnWrapper>
            <Alert variant={'info'}>
                <Heading size={'xsmall'} level={'4'}>
                    {tittel}
                </Heading>
                <BodyLong size={'small'}>
                    Bruker har i søknad krysset av for at dokumentasjonen er sendt inn til NAV
                    tidligere
                </BodyLong>
            </Alert>
        </DokumentasjonSendtInnWrapper>
    ) : null;
};
export default DokumentasjonSendtInn;
