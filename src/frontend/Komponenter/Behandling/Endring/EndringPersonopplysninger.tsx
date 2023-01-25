import React from 'react';
import { RessursStatus } from '../../../App/typer/ressurs';
import { useHentVilkår } from '../../../App/hooks/useHentVilkår';
import { Alert, Heading } from '@navikt/ds-react';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { erEndringPåPersonopplysninger } from './utils';
import { useToggles } from '../../../App/context/TogglesContext';
import { ToggleName } from '../../../App/context/toggles';

const EndringPersonopplsyninger: React.FC<{
    behandlingId: string;
}> = ({ behandlingId }) => {
    const { endringerPersonopplysninger, hentEndringerForPersonopplysninger } = useHentVilkår();
    const { toggles } = useToggles();
    const skalViseKomponent = toggles[ToggleName.visEndringerPersonopplysninger];

    React.useEffect(() => {
        if (behandlingId !== undefined && skalViseKomponent) {
            if (endringerPersonopplysninger.status !== RessursStatus.SUKSESS) {
                hentEndringerForPersonopplysninger(behandlingId);
            }
        }
        // eslint-disable-next-line
    }, [behandlingId]);

    if (!skalViseKomponent) {
        return <></>;
    }

    return (
        <DataViewer response={{ endringerPersonopplysninger }}>
            {({ endringerPersonopplysninger }) => {
                const erEndring = erEndringPåPersonopplysninger(endringerPersonopplysninger);

                if (!erEndring) {
                    return <></>;
                }

                return (
                    <Alert variant="warning" title="Endring i folkeregisteropplysninger">
                        <Heading spacing size="small" level="2">
                            Endring i folkeregisteropplysninger
                        </Heading>
                        Det har vært endringer i brukers opplysnginger fra folkeregisteret siden
                        denne behandlingen ble påbegynt.
                    </Alert>
                );
            }}
        </DataViewer>
    );
};

export default EndringPersonopplsyninger;
