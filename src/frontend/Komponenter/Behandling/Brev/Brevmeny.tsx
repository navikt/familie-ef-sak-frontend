import React, { useEffect, useState } from 'react';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import BrevmenyVisning from './BrevmenyVisning';
import styled from 'styled-components';
import {
    IMellomlagretBrevResponse,
    useMellomlagringBrev,
} from '../../../App/hooks/useMellomlagringBrev';
import { Behandling } from '../../../App/typer/fagsak';
import { useHentBeløpsperioder } from '../../../App/hooks/useHentBeløpsperioder';
import { EBehandlingResultat } from '../../../App/typer/vedtak';
import { IPersonopplysninger } from '../../../App/typer/personopplysninger';
import { BrevmalSelect } from './BrevmalSelect';
import { useHentBrevStruktur } from '../../../App/hooks/useHentBrevStruktur';
import { useHentBrevmaler } from '../../../App/hooks/useHentBrevmaler';
import { useVerdierForBrev } from '../../../App/hooks/useVerdierForBrev';
import { utledHtmlFelterPåStønadstype } from './BrevUtils';
import { useBehandling } from '../../../App/context/BehandlingContext';

export interface Props {
    oppdaterBrevRessurs: (brevRessurs: Ressurs<string>) => void;
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

const Brevmeny: React.FC<Props> = ({
    oppdaterBrevRessurs,
    behandling,
    vedtaksresultat,
    personopplysninger,
    settKanSendesTilBeslutter,
}) => {
    const { hentBeløpsperioder, beløpsperioder } = useHentBeløpsperioder(
        behandling.id,
        behandling.stønadstype
    );
    const { vedtak } = useBehandling();
    const [brevMal, settBrevmal] = useState<string>();

    const { brevmaler } = useHentBrevmaler();
    const { brevStruktur } = useHentBrevStruktur(brevMal);

    useEffect(() => {
        hentBeløpsperioder(vedtaksresultat);
    }, [vedtaksresultat, hentBeløpsperioder]);

    const { mellomlagreSanitybrev, mellomlagretBrev } = useMellomlagringBrev(behandling.id);
    useEffect(() => {
        if (mellomlagretBrev.status === RessursStatus.SUKSESS && mellomlagretBrev.data) {
            settBrevmal(mellomlagretBrev.data.brevmal);
        }
    }, [mellomlagretBrev]);

    const brevverdier = useVerdierForBrev(beløpsperioder, behandling, vedtak);

    return (
        <StyledBrevMeny>
            <BrevmalSelect
                brevmal={brevMal}
                settBrevmal={settBrevmal}
                dokumentnavn={brevmaler}
                stønanadstype={behandling.stønadstype}
            />
            <DataViewer
                response={{
                    brevStruktur,
                    mellomlagretBrev,
                }}
            >
                {({ brevStruktur, mellomlagretBrev }) =>
                    brevMal ? (
                        <BrevmenyVisning
                            behandlingId={behandling.id}
                            oppdaterBrevRessurs={oppdaterBrevRessurs}
                            brevStruktur={brevStruktur}
                            brevMal={brevMal}
                            mellomlagretBrevVerdier={
                                (mellomlagretBrev as IMellomlagretBrevResponse)?.brevverdier
                            }
                            personopplysninger={personopplysninger}
                            mellomlagreSanityBrev={mellomlagreSanitybrev}
                            htmlFelter={utledHtmlFelterPåStønadstype(
                                behandling.stønadstype,
                                beløpsperioder
                            )}
                            brevverdier={brevverdier}
                            settBrevOppdatert={settKanSendesTilBeslutter}
                        />
                    ) : null
                }
            </DataViewer>
        </StyledBrevMeny>
    );
};

export default Brevmeny;
