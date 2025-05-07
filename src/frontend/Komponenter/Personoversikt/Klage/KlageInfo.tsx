import React, { useEffect } from 'react';
import styled from 'styled-components';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { stønadstypeTilTekst } from '../../../App/typer/behandlingstema';
import { Alert } from '@navikt/ds-react';
import { useHentKlagebehandlinger } from '../../../App/hooks/useHentKlagebehandlinger';
import { RessursStatus } from '../../../App/typer/ressurs';
import {
    personHarÅpenAnke,
    stønadstyperMedÅpenSakNavKlageinstans,
    stønasatyperMedÅpenKlage,
} from './klageInfoUtils';

const AdvarselVisning = styled(Alert)`
    margin-top: 0.5rem;
`;

const KlageInfo: React.FunctionComponent<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { hentKlagebehandlinger, klagebehandlinger } = useHentKlagebehandlinger();
    useEffect(() => {
        if (klagebehandlinger.status === RessursStatus.IKKE_HENTET) {
            hentKlagebehandlinger(fagsakPersonId);
        }
    }, [hentKlagebehandlinger, fagsakPersonId, klagebehandlinger]);
    return (
        <DataViewer response={{ klagebehandlinger }}>
            {({ klagebehandlinger }) => {
                const åpneKlagerPerStønadstype = stønasatyperMedÅpenKlage(klagebehandlinger);
                const åpneKlagerNavKlageinstans =
                    stønadstyperMedÅpenSakNavKlageinstans(klagebehandlinger);

                if (
                    åpneKlagerPerStønadstype.length === 0 &&
                    åpneKlagerNavKlageinstans.length === 0 &&
                    !personHarÅpenAnke(klagebehandlinger)
                ) {
                    return null;
                }

                const åpneKlagerTekst = åpneKlagerPerStønadstype
                    .map((stønadstype) => stønadstypeTilTekst[stønadstype])
                    .join(', ');

                const åpneKlagerNavKlageinstansTekst = åpneKlagerNavKlageinstans
                    .map((stønadstype) => stønadstypeTilTekst[stønadstype])
                    .join(', ');
                return (
                    <>
                        {åpneKlagerNavKlageinstans.length > 0 && (
                            <AdvarselVisning variant={'warning'} size={'small'}>
                                Merk at en klage er til behandling hos Nav Klageinstans på
                                stønadstype: {åpneKlagerNavKlageinstansTekst}
                            </AdvarselVisning>
                        )}
                        {åpneKlagerPerStønadstype.length > 0 && (
                            <AdvarselVisning variant={'warning'} size={'small'}>
                                Merk at det ligger en åpen klage på stønadstype: {åpneKlagerTekst}
                            </AdvarselVisning>
                        )}
                        {personHarÅpenAnke(klagebehandlinger) && (
                            <AdvarselVisning variant={'warning'} size={'small'}>
                                Det finnes informasjon om anke på denne brukeren. Gå inn på
                                klagebehandlingens resultatside for å se detaljer.
                            </AdvarselVisning>
                        )}
                    </>
                );
            }}
        </DataViewer>
    );
};

export default KlageInfo;
