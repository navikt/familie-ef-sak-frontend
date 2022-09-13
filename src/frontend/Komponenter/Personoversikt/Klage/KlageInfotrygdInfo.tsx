import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { byggTomRessurs, Ressurs } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';
import { Stønadstype, stønadstypeTilTekst } from '../../../App/typer/behandlingstema';

interface ÅpneKlagerResponse {
    infotrygd: {
        overgangsstønad: boolean;
        barnetilsyn: boolean;
        skolepenger: boolean;
    };
}

const AdvarselVisning = styled(AlertStripeAdvarsel)`
    margin-top: 1.5rem;
    max-width: 60rem;
    .alertstripe__tekst {
        max-width: 60rem;
    }
`;

const mapÅpneKlagerTilTekst = (åpneKlager: ÅpneKlagerResponse): string | undefined => {
    const overgangsstønad = åpneKlager.infotrygd.overgangsstønad && Stønadstype.OVERGANGSSTØNAD;
    const barnetilsyn = åpneKlager.infotrygd.barnetilsyn && Stønadstype.BARNETILSYN;
    const skolepenger = åpneKlager.infotrygd.skolepenger && Stønadstype.SKOLEPENGER;

    const stønadstyper = (
        [overgangsstønad, barnetilsyn, skolepenger].filter((stønad) => !!stønad) as Stønadstype[]
    ).map((stønad) => stønadstypeTilTekst[stønad]);
    if (stønadstyper.length === 0) {
        return undefined;
    }
    return stønadstyper.join(', ');
};

export const KlageInfotrygdInfo: React.FunctionComponent<{ fagsakPersonId: string }> = ({
    fagsakPersonId,
}) => {
    const { axiosRequest } = useApp();
    const [åpneKlager, settÅpneKlager] = useState<Ressurs<ÅpneKlagerResponse>>(byggTomRessurs());

    useEffect(() => {
        axiosRequest<ÅpneKlagerResponse, null>({
            method: 'GET',
            url: `/familie-ef-sak/api/klage/fagsak-person/${fagsakPersonId}/apen`,
        }).then(settÅpneKlager);
    }, [axiosRequest, fagsakPersonId]);

    return (
        <DataViewer response={{ åpneKlager }}>
            {({ åpneKlager }) => {
                const åpneKlagerTekst = mapÅpneKlagerTilTekst(åpneKlager);
                if (!åpneKlagerTekst) return null;

                return (
                    <AdvarselVisning>
                        Merk at det ligger en åpen klage i Infortrygd på stønadstype:{' '}
                        {åpneKlagerTekst}
                    </AdvarselVisning>
                );
            }}
        </DataViewer>
    );
};

export default KlageInfotrygdInfo;
