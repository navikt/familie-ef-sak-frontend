import React, { useEffect } from 'react';
import { FagsakOversikt } from './FagsakOversikt';
import { useHentFagsakPersonUtvidet } from '../../App/hooks/useHentFagsakPerson';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import KlageInfotrygdInfo from './Klage/KlageInfotrygdInfo';
import { useHentKlagebehandlinger } from '../../App/hooks/useHentKlagebehandlinger';
import Utestengelse from './Utestengelse/Utestengelse';
import { useHentUtestengelser } from '../../App/hooks/useHentUtestengelser';
import { InfostripeUtestengelse } from './InfostripeUtestengelse';

export enum BehandlingApplikasjon {
    EF_SAK = 'EF_SAK',
    KLAGE = 'KLAGE',
    TILBAKEKREVING = 'TILBAKEKREVING',
}

const Behandlingsoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { hentFagsakPerson, fagsakPerson } = useHentFagsakPersonUtvidet();
    const { hentKlagebehandlinger, klagebehandlinger } = useHentKlagebehandlinger();
    const { hentUtestengelser, utestengelser } = useHentUtestengelser(fagsakPersonId);

    useEffect(() => {
        hentUtestengelser();
    }, [hentUtestengelser]);

    useEffect(() => {
        hentFagsakPerson(fagsakPersonId);
        hentKlagebehandlinger(fagsakPersonId);
    }, [fagsakPersonId, hentFagsakPerson, hentKlagebehandlinger]);

    const reHentKlagebehandlinger = () => {
        hentKlagebehandlinger(fagsakPersonId);
    };
    return (
        <DataViewer response={{ fagsakPerson, klagebehandlinger }}>
            {({ fagsakPerson, klagebehandlinger }) => (
                <>
                    <InfostripeUtestengelse utestengelser={utestengelser} />
                    <KlageInfotrygdInfo fagsakPersonId={fagsakPersonId} />
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
                        fagsakPersonId={fagsakPersonId}
                        utestengelser={utestengelser}
                        hentUtestengelser={hentUtestengelser}
                    />
                </>
            )}
        </DataViewer>
    );
};

export default Behandlingsoversikt;
