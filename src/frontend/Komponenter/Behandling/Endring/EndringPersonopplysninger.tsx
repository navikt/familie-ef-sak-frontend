import React, { useEffect } from 'react';
import { RessursStatus } from '../../../App/typer/ressurs';
import { useHentVilkår } from '../../../App/hooks/useHentVilkår';
import { Alert, Heading } from '@navikt/ds-react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { utledEndringerPåPersonopplysninger } from './utils';
import { useToggles } from '../../../App/context/TogglesContext';
import { ToggleName } from '../../../App/context/toggles';
import { endringerKeyTilTekst } from '../Inngangsvilkår/vilkår';
import { Behandling } from '../../../App/typer/fagsak';
import { utredesEllerFatterVedtak } from '../../../App/typer/behandlingstatus';

const EndringPersonopplsyninger: React.FC<{
    behandling: Behandling;
}> = ({ behandling }) => {
    const { endringerPersonopplysninger, hentEndringerForPersonopplysninger } = useHentVilkår();
    const { toggles } = useToggles();
    const skalViseKomponent = toggles[ToggleName.visEndringerPersonopplysninger];
    const behandlingId = behandling.id;

    useEffect(() => {
        if (
            utredesEllerFatterVedtak(behandling) &&
            endringerPersonopplysninger.status === RessursStatus.IKKE_HENTET
        ) {
            hentEndringerForPersonopplysninger(behandlingId);
        }
        // eslint-disable-next-line
    }, [behandling]);

    if (!skalViseKomponent) {
        return <></>;
    }

    return (
        <DataViewer response={{ endringerPersonopplysninger }}>
            {({ endringerPersonopplysninger }) => {
                const endringer = utledEndringerPåPersonopplysninger(endringerPersonopplysninger);
                const erEndring = endringer.length > 0;

                if (!erEndring) {
                    return <></>;
                }

                return (
                    <Alert variant="warning" title="Endring i folkeregisteropplysninger">
                        <Heading spacing size="small" level="2">
                            Endring i folkeregisteropplysninger
                        </Heading>
                        <div>
                            Det har vært endringer i bruker sine opplysninger fra folkeregisteret
                            siden denne behandlingen ble påbegynt. Endringene gjelder:
                        </div>
                        <ul>
                            {endringer.map((personopplysning) => (
                                <li key={personopplysning}>
                                    {endringerKeyTilTekst[personopplysning]}
                                </li>
                            ))}
                        </ul>
                    </Alert>
                );
            }}
        </DataViewer>
    );
};

export default EndringPersonopplsyninger;
