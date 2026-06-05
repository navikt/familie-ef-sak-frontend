import * as React from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext.tsx';
import { useApp } from '../../../App/context/AppContext.tsx';
import { VStack, InlineMessage, Radio, RadioGroup, BodyShort } from '@navikt/ds-react';
import { RessursStatus } from '../../../App/typer/ressurs.ts';
import { useParams } from 'react-router-dom';

export const BehandleSom2026Regelendring: React.FC = () => {
    const { behandlingId } = useParams<{ behandlingId: string }>();
    const { erRegelendring2026, settErRegelendring2026, behandlingErRedigerbar } = useBehandling();
    const { axiosRequest } = useApp();

    const oppdaterRegelendring = (nyVerdi: boolean) => {
        axiosRequest<string, { erRegelendring2026: boolean }>({
            method: 'POST',
            url: `/familie-ef-sak/api/behandling/${behandlingId}/regelendring-2026`,
            data: { erRegelendring2026: nyVerdi },
        }).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                settErRegelendring2026(nyVerdi);
            }
        });
    };

    return (
        <VStack>
            {erRegelendring2026 && (
                <InlineMessage status={'info'}>
                    Mottatt søknad etter gammelt regelverk
                </InlineMessage>
            )}
            <BodyShort>
                Ønsker du å behandle denne saken etter nytt eller gammelt regelverk?
            </BodyShort>
            <RadioGroup
                legend="Behandle etter nytt regelverk (2026)"
                hideLegend
                value={erRegelendring2026}
                onChange={oppdaterRegelendring}
                readOnly={!behandlingErRedigerbar}
            >
                <Radio value={true}>Nytt regelverk (fra 01.07.2026)</Radio>
                <Radio value={false}>Gammelt regelverk</Radio>
            </RadioGroup>
        </VStack>
    );
};
