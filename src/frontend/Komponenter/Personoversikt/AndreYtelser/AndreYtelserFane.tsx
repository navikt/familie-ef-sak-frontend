import React, { useEffect } from 'react';
import { useHentAndreYtelser } from '../../../App/hooks/useHentAndreYtelser';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { VedtakAAP } from './VedtakAAP';
import { Heading, HStack } from '@navikt/ds-react';

interface Props {
    fagsakPersonId: string;
}

export const AndreYtelserFane: React.FC<Props> = ({ fagsakPersonId }) => {
    const { andreYtelser, hentAndreYtelser } = useHentAndreYtelser(fagsakPersonId);

    useEffect(() => {
        hentAndreYtelser();
    }, [hentAndreYtelser]);

    return (
        <DataViewer response={{ andreYtelser }}>
            {({ andreYtelser }) => {
                return (
                    <>
                        <Heading size={'medium'} level="1">
                            Informasjon om andre ytelser
                        </Heading>
                        <HStack gap="8" style={{ marginTop: '1rem', marginLeft: '1rem' }}>
                            <VedtakAAP vedtak={andreYtelser.arbeidsavklaringspenger.vedtak} />
                        </HStack>
                    </>
                );
            }}
        </DataViewer>
    );
};
