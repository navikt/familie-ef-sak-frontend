import React from 'react';
import { Systemtittel } from 'nav-frontend-typografi';
import Etikett from 'nav-frontend-etiketter';
import Visittkort from '@navikt/familie-visittkort';
import { kjønnType } from '@navikt/familie-typer';
import { Behandlingstype } from '../typer/behandlingstype';
import { BehandlingStatus } from '../typer/behandlingstatus';

interface Fagsakoversikt {
    overgansstønad: any[];
    barnetilsyn: any[];
    skole: any[];
}

const Fagsakoversikt: React.FC = () => {
    return (
        <div>
            <Visittkort alder={19} ident="10008999321" kjønn={kjønnType.MANN} navn="Batman" />
            <div style={{ display: 'flex' }}>
                <Systemtittel tag="h3">Fagsak: Overgansstønad</Systemtittel>
                <Etikett type="info">Opprettet</Etikett>
            </div>
            <FagsakoversiktTabell status="Opprettet" fagsakType="Overgansstønad" data={[]} />
            <div>
                <Systemtittel tag="h3">Fagsak: Barnetilsyn</Systemtittel>
            </div>
            <div>
                <Systemtittel tag="h3">Fagsak: Skolepenger</Systemtittel>
            </div>
        </div>
    );
};
/*

 */

export default Fagsakoversikt;

interface Tralala {
    opprettetDato: string;
    type: Behandlingstype;
    status: BehandlingStatus;
    resultat: string;
    behandlingId: string;
}

const FagsakoversiktTabell: React.FC<{ fagsakType: string; status: string; data: any[] }> = () => {
    return (
        <table className="tabell">
            <thead>
                <tr>
                    <th role="columnheader">Behandling opprettetdato</th>
                    <th role="columnheader">Type</th>
                    <th role="columnheader">Status</th>
                    <th role="columnheader">Resultat</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>21.01.2021</td>
                    <td>Revurdering</td>
                    <td>Fatter vedtak</td>
                    <td>25.01.2021</td>
                    <td>Ikke satt</td>
                </tr>
            </tbody>
        </table>
    );
};
