import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';
import { Stønadstype, stønadstypeTilTekst } from '../../../App/typer/behandlingstema';
import { Alert } from '@navikt/ds-react';

interface ÅpneInfotrygdKlagerResponse {
    stønadstyper: Stønadstype[];
}

const AdvarselVisning = styled(Alert)`
    margin-top: 0.5rem;
`;

export const KlageInfotrygdInfo: React.FunctionComponent<{ fagsakPersonId: string }> = ({
    fagsakPersonId,
}) => {
    const { axiosRequest } = useApp();
    const [åpneKlager, settÅpneKlager] = useState<Ressurs<ÅpneInfotrygdKlagerResponse>>(
        byggTomRessurs()
    );

    useEffect(() => {
        axiosRequest<ÅpneInfotrygdKlagerResponse, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/klage/fagsak-person/${fagsakPersonId}/infotrygd`,
        }).then(settÅpneKlager);
    }, [axiosRequest, fagsakPersonId]);

    return (
        <DataViewer response={{ åpneKlager }}>
            {({ åpneKlager }) => {
                if (åpneKlager.stønadstyper.length === 0) {
                    return null;
                }

                const åpneKlagerTekst = åpneKlager.stønadstyper
                    .map((stønadstype) => stønadstypeTilTekst[stønadstype])
                    .join(', ');
                return (
                    <AdvarselVisning variant={'warning'} size={'small'}>
                        Merk at det ligger en åpen klage i Infortrygd på stønadstype:{' '}
                        {åpneKlagerTekst}
                    </AdvarselVisning>
                );
            }}
        </DataViewer>
    );
};

export default KlageInfotrygdInfo;
