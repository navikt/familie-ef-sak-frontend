import React, { useEffect } from 'react';
import styled from 'styled-components';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { Stønadstype, stønadstypeTilTekst } from '../../../App/typer/behandlingstema';
import { Alert } from '@navikt/ds-react';
import { useHentKlagebehandlinger } from '../../../App/hooks/useHentKlagebehandlinger';
import {
    KlageBehandling,
    Klagebehandlinger,
    KlagebehandlingStatus,
} from '../../../App/typer/klage';
import { RessursStatus } from '../../../App/typer/ressurs';

const AdvarselVisning = styled(Alert)`
    margin-top: 0.5rem;
`;

function erKlageUnderArbeid(klagebehandling: KlageBehandling) {
    return (
        klagebehandling.status == KlagebehandlingStatus.OPPRETTET ||
        klagebehandling.status == KlagebehandlingStatus.UTREDES
    );
}

const åpneKlager = (klagebehandlinger: Klagebehandlinger): Stønadstype[] => {
    const stønadstyperMedÅpenKlage: Stønadstype[] = [];
    if (klagebehandlinger.overgangsstønad.some(erKlageUnderArbeid)) {
        stønadstyperMedÅpenKlage.push(Stønadstype.OVERGANGSSTØNAD);
    }
    if (klagebehandlinger.barnetilsyn.some(erKlageUnderArbeid)) {
        stønadstyperMedÅpenKlage.push(Stønadstype.BARNETILSYN);
    }
    if (klagebehandlinger.skolepenger.some(erKlageUnderArbeid)) {
        stønadstyperMedÅpenKlage.push(Stønadstype.SKOLEPENGER);
    }

    return stønadstyperMedÅpenKlage;
};

export const KlageInfo: React.FunctionComponent<{ fagsakPersonId: string }> = ({
    fagsakPersonId,
}) => {
    const { hentKlagebehandlinger, klagebehandlinger } = useHentKlagebehandlinger();
    useEffect(() => {
        if (klagebehandlinger.status === RessursStatus.IKKE_HENTET) {
            hentKlagebehandlinger(fagsakPersonId);
        }
    }, [hentKlagebehandlinger, fagsakPersonId, klagebehandlinger]);
    return (
        <DataViewer response={{ klagebehandlinger }}>
            {({ klagebehandlinger }) => {
                const åpneKlagerPerStønadstype = åpneKlager(klagebehandlinger);
                if (åpneKlagerPerStønadstype.length === 0) {
                    return null;
                }

                const åpneKlagerTekst = åpneKlagerPerStønadstype
                    .map((stønadstype) => stønadstypeTilTekst[stønadstype])
                    .join(', ');
                return (
                    <AdvarselVisning variant={'warning'} size={'small'}>
                        Merk at det ligger en åpen klage på stønadstype: {åpneKlagerTekst}
                    </AdvarselVisning>
                );
            }}
        </DataViewer>
    );
};

export default KlageInfo;
