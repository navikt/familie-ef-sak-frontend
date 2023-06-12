import React, { useEffect, useState } from 'react';
import { BrevStruktur, Brevtype, DokumentNavn, IMellomlagretBrevFritekst } from './BrevTyper';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import BrevmenyVisning from './BrevmenyVisning';
import styled from 'styled-components';
import {
    IMellomlagretBrevResponse,
    useMellomlagringBrev,
} from '../../../App/hooks/useMellomlagringBrev';
import FritekstBrev from './FritekstBrev';
import { useToggles } from '../../../App/context/TogglesContext';
import { ToggleName } from '../../../App/context/toggles';
import { Behandling } from '../../../App/typer/fagsak';
import { useHentBeløpsperioder } from '../../../App/hooks/useHentBeløpsperioder';
import { Stønadstype } from '../../../App/typer/behandlingstema';
import { Select } from '@navikt/ds-react';
import { EBehandlingResultat } from '../../../App/typer/vedtak';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';

export interface BrevmenyProps {
    oppdaterBrevRessurs: (brevRessurs: Ressurs<string>) => void;
    behandlingId: string;
    personopplysninger: IPersonopplysninger;
    settKanSendesTilBeslutter: (kanSendesTilBeslutter: boolean) => void;
    behandling: Behandling;
    vedtaksresultat?: EBehandlingResultat;
}

const StyledBrevMeny = styled.div`
    display: flex;
    flex-direction: column;
    min-width: 450px;
    margin-top: 2rem;
`;

const datasett = 'ef-brev';
const fritekstmal = 'Fritekstbrev';

const Brevmeny: React.FC<BrevmenyProps> = (props) => {
    const {
        oppdaterBrevRessurs,
        behandling,
        vedtaksresultat,
        behandlingId,
        personopplysninger,
        settKanSendesTilBeslutter,
    } = props;
    const { axiosRequest } = useApp();
    const { hentBeløpsperioder, beløpsperioder } = useHentBeløpsperioder(
        behandling.id,
        behandling.stønadstype
    );
    const [brevMal, settBrevmal] = useState<string>();

    const { brevmaler } = useHentBrevmaler();
    const { brevStruktur } = useHentBrevStruktur(brevMal);

    useEffect(() => {
        hentBeløpsperioder(vedtaksresultat);
    }, [vedtaksresultat, hentBeløpsperioder]);

    const { mellomlagreSanitybrev, mellomlagretBrev } = useMellomlagringBrev(behandlingId);
    useEffect(() => {
        if (mellomlagretBrev.status === RessursStatus.SUKSESS) {
            if (mellomlagretBrev.data?.brevtype === Brevtype.SANITYBREV) {
                settBrevmal(mellomlagretBrev.data.brevmal);
            } else if (mellomlagretBrev.data?.brevtype === Brevtype.FRITEKSTBREV) {
                settBrevmal('Fritekstbrev');
            }
        }
    }, [mellomlagretBrev]);

    const brevverdier = useVerdierForBrev(beløpsperioder, behandling);

    return (
        <StyledBrevMeny>
            <BrevmalSelect
                brevmal={brevMal}
                settBrevmal={settBrevmal}
                dokumentnavn={brevmaler}
                stønanadstype={behandling.stønadstype}
            />
            {brevMal === fritekstmal ? (
                <DataViewer response={{ mellomlagretBrev }}>
                    {({ mellomlagretBrev }) => (
                        <FritekstBrev
                            behandlingId={behandlingId}
                            oppdaterBrevressurs={oppdaterBrevRessurs}
                            mellomlagretFritekstbrev={mellomlagretBrev as IMellomlagretBrevFritekst}
                        />
                    )}
                </DataViewer>
            ) : (
                <DataViewer
                    response={{
                        brevStruktur,
                        mellomlagretBrev,
                        beløpsperioder,
                    }}
                >
                    {({ brevStruktur, mellomlagretBrev, beløpsperioder }) =>
                        brevMal ? (
                            <BrevmenyVisning
                                behandlingId={behandlingId}
                                oppdaterBrevRessurs={oppdaterBrevRessurs}
                                behandling={behandling}
                                brevStruktur={brevStruktur}
                                beløpsperioder={beløpsperioder}
                                brevMal={brevMal}
                                mellomlagretBrevVerdier={
                                    (mellomlagretBrev as IMellomlagretBrevResponse)?.brevverdier
                                }
                                stønadstype={behandling.stønadstype}
                                personopplysninger={personopplysninger}
                                settKanSendesTilBeslutter={settKanSendesTilBeslutter}
                            />
                        ) : null
                    }
                </DataViewer>
            )}
        </StyledBrevMeny>
    );
};

export default Brevmeny;
