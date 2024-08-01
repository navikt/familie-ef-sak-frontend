import React, { useEffect } from 'react';
import { FagsakOversikt } from './FagsakOversikt';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { useHentKlagebehandlinger } from '../../App/hooks/useHentKlagebehandlinger';
import Utestengelse from './Utestengelse/Utestengelse';
import { useHentUtestengelser } from '../../App/hooks/useHentUtestengelser';
import { InfostripeUtestengelse } from './InfostripeUtestengelse';
import { ÅpneKlager } from './Klage/ÅpneKlager';
import { FagsakPerson } from '../../App/typer/fagsak';

export enum BehandlingApplikasjon {
    EF_SAK = 'EF_SAK',
    KLAGE = 'KLAGE',
    TILBAKEKREVING = 'TILBAKEKREVING',
}

export const Behandlingsoversikt: React.FC<{
    fagsakPerson: FagsakPerson;
}> = ({ fagsakPerson }) => {
    const { hentKlagebehandlinger, klagebehandlinger } = useHentKlagebehandlinger();
    const { hentUtestengelser, utestengelser } = useHentUtestengelser();

    useEffect(() => {
        hentUtestengelser(fagsakPerson.id);
    }, [hentUtestengelser, fagsakPerson.id]);

    useEffect(() => {
        hentKlagebehandlinger(fagsakPerson.id);
    }, [fagsakPerson.id, hentKlagebehandlinger]);

    const reHentKlagebehandlinger = () => {
        hentKlagebehandlinger(fagsakPerson.id);
    };
    return (
        <DataViewer response={{ klagebehandlinger }}>
            {({ klagebehandlinger }) => (
                <>
                    <InfostripeUtestengelse utestengelser={utestengelser} />
                    <ÅpneKlager fagsakPersonId={fagsakPerson.id} />
                    {fagsakPerson.overgangsstønad && (
                        <FagsakOversikt
                            fagsak={fagsakPerson.overgangsstønad}
                            klageBehandlinger={klagebehandlinger.overgangsstønad}
                            hentKlageBehandlinger={reHentKlagebehandlinger}
                        />
                    )}
                    {fagsakPerson.barnetilsyn && (
                        <FagsakOversikt
                            fagsak={fagsakPerson.barnetilsyn}
                            klageBehandlinger={klagebehandlinger.barnetilsyn}
                            hentKlageBehandlinger={reHentKlagebehandlinger}
                        />
                    )}
                    {fagsakPerson.skolepenger && (
                        <FagsakOversikt
                            fagsak={fagsakPerson.skolepenger}
                            klageBehandlinger={klagebehandlinger.skolepenger}
                            hentKlageBehandlinger={reHentKlagebehandlinger}
                        />
                    )}
                    <Utestengelse
                        fagsakPersonId={fagsakPerson.id}
                        utestengelser={utestengelser}
                        hentUtestengelser={hentUtestengelser}
                    />
                </>
            )}
        </DataViewer>
    );
};
