import React, { useEffect } from 'react';
import { FagsakOversikt } from './FagsakOversikt';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { useHentKlagebehandlinger } from '../../App/hooks/useHentKlagebehandlinger';
import Utestengelse from './Utestengelse/Utestengelse';
import { useHentUtestengelser } from '../../App/hooks/useHentUtestengelser';
import { InfostripeUtestengelse } from './InfostripeUtestengelse';
import { ÅpneKlager } from './Klage/ÅpneKlager';
import { FagsakPerson } from '../../App/typer/fagsak';
import { Heading, VStack } from '@navikt/ds-react';
import styled from 'styled-components';

export enum BehandlingApplikasjon {
    EF_SAK = 'EF_SAK',
    KLAGE = 'KLAGE',
    TILBAKEKREVING = 'TILBAKEKREVING',
}

const Tittel = styled(Heading)`
    margin-top: 1rem;
`;

export const Behandlingsoversikt: React.FC<{
    fagsakPerson: FagsakPerson;
}> = ({ fagsakPerson }) => {
    const { hentKlagebehandlinger, klagebehandlinger } = useHentKlagebehandlinger();
    const { hentUtestengelser, utestengelser } = useHentUtestengelser();

    const harFagsak =
        fagsakPerson.overgangsstønad?.id ||
        fagsakPerson.barnetilsyn?.id ||
        fagsakPerson.skolepenger?.id;

    const reHentKlagebehandlinger = () => {
        hentKlagebehandlinger(fagsakPerson.id);
    };

    useEffect(() => {
        hentUtestengelser(fagsakPerson.id);
    }, [hentUtestengelser, fagsakPerson.id]);

    useEffect(() => {
        hentKlagebehandlinger(fagsakPerson.id);
    }, [fagsakPerson.id, hentKlagebehandlinger]);

    return (
        <DataViewer response={{ klagebehandlinger }}>
            {({ klagebehandlinger }) => (
                <VStack gap={'space-16'}>
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
                    {!harFagsak && (
                        <Tittel level="3" size="medium">
                            Ingen fagsaker i EF Sak
                        </Tittel>
                    )}
                    {harFagsak && (
                        <Utestengelse
                            fagsakPersonId={fagsakPerson.id}
                            utestengelser={utestengelser}
                            hentUtestengelser={hentUtestengelser}
                        />
                    )}
                </VStack>
            )}
        </DataViewer>
    );
};
