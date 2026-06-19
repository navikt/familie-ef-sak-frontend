import React, { FC } from 'react';
import { useState } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext.tsx';
import { useApp } from '../../../App/context/AppContext.tsx';
import { BodyShort, Radio, RadioGroup, VStack } from '@navikt/ds-react';
import { RessursStatus } from '../../../App/typer/ressurs.ts';
import { useParams } from 'react-router-dom';
import { BekreftRegelendringModal } from './BekreftRegelendringModal.tsx';
import { regelverkLabel } from '../../../App/typer/behandlingstype.ts';

export const BehandleSom2026Regelendring: FC = () => {
    const { behandlingId } = useParams<{ behandlingId: string }>();
    const {
        erRegelendring2026,
        settErRegelendring2026,
        behandlingErRedigerbar,
        hentVedtak,
        hentBehandling,
    } = useBehandling();
    const { axiosRequest } = useApp();

    const [visBekreftelsesmodal, settVisBekreftelsesmodal] = useState(false);
    const [pendingVerdi, settNyVerdi] = useState<boolean | null>(null);

    const håndterRegelendring = (nyVerdi: boolean) => {
        settNyVerdi(nyVerdi);
        settVisBekreftelsesmodal(true);
    };

    const bekreftEndring = () => {
        if (pendingVerdi === null) return;
        axiosRequest<string, { erRegelendring2026: boolean }>({
            method: 'POST',
            url: `/familie-ef-sak/api/behandling/${behandlingId}/regelendring-2026`,
            data: { erRegelendring2026: pendingVerdi },
        }).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                settErRegelendring2026(pendingVerdi);
                hentBehandling.rerun();
                hentVedtak.rerun();
            }
        });
        settVisBekreftelsesmodal(false);
        settNyVerdi(null);
    };

    const avbrytEndring = () => {
        settVisBekreftelsesmodal(false);
        settNyVerdi(null);
    };

    return (
        <VStack>
            <BodyShort>
                Ønsker du å behandle denne saken etter nytt eller tidligere regelverk?
            </BodyShort>
            <RadioGroup
                legend="Behandle etter nytt regelverk (2026)"
                hideLegend
                value={erRegelendring2026}
                onChange={håndterRegelendring}
                readOnly={!behandlingErRedigerbar}
            >
                <Radio value={true}> {regelverkLabel.NYTT_REGELVERK.tekst}</Radio>
                <Radio value={false}>{regelverkLabel.TIDLIGERE_REGELVERK.tekst}</Radio>
            </RadioGroup>

            <BekreftRegelendringModal
                open={visBekreftelsesmodal}
                nyVerdi={pendingVerdi}
                onBekreft={bekreftEndring}
                onAvbryt={avbrytEndring}
            />
        </VStack>
    );
};
