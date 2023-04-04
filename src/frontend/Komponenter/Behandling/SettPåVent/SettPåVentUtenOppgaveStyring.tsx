import React, { FC, useState } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { useApp } from '../../../App/context/AppContext';
import { Alert, BodyLong, Button, Heading } from '@navikt/ds-react';
import styled from 'styled-components';
import { ABgSubtle } from '@navikt/ds-tokens/dist/tokens';
import { useToggles } from '../../../App/context/TogglesContext';
import { ToggleName } from '../../../App/context/toggles';

const AlertStripe = styled(Alert)`
    margin-top: 1rem;
`;

const SettPåVentWrapper = styled.div`
    display: grid;
    grid-template-rows: auto 1fr;
    background-color: ${ABgSubtle};
    padding: 2rem;
    min-height: 30vh;
    max-height: 70vh;
`;

const KnappeWrapper = styled.div`
    display: flex;
    gap: 2rem;
    justify-content: flex-end;
    margin-right: 15%;
`;

/**
 * Kan slettes når ToggleName.settPåVentMedOppgavestyring er skrudd på
 */
export const SettPåVentUtenOppgaveStyring: FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { visSettPåVent, settVisSettPåVent, hentBehandling } = useBehandling();

    const { axiosRequest } = useApp();
    const { toggles } = useToggles();
    const [låsKnapp, settLåsKnapp] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();

    const lukkModal = () => {
        settFeilmelding('');
        settVisSettPåVent(false);
    };

    const settPåVent = () => {
        if (låsKnapp) {
            return;
        }

        settLåsKnapp(true);

        axiosRequest<string, null>({
            method: 'POST',
            url: `/familie-ef-sak/api/behandling/${behandlingId}/vent`,
        })
            .then((respons: RessursFeilet | RessursSuksess<string>) => {
                if (respons.status == RessursStatus.SUKSESS) {
                    hentBehandling.rerun();
                    lukkModal();
                } else {
                    settFeilmelding(respons.frontendFeilmelding);
                }
            })
            .finally(() => settLåsKnapp(false));
    };

    return visSettPåVent && !toggles[ToggleName.settPåVentMedOppgavestyring] ? (
        <SettPåVentWrapper>
            <Heading size={'medium'}>Sett behandling på vent</Heading>
            <BodyLong>
                Behandlingen settes på vent, men du må inntil videre huske å oppdatere oppgaven i
                Gosys i henhold til gjeldende rutiner.
            </BodyLong>
            <KnappeWrapper>
                <Button
                    onClick={() => settVisSettPåVent(false)}
                    type={'button'}
                    variant={'tertiary'}
                >
                    Avbryt
                </Button>
                <Button onClick={settPåVent} type={'button'} disabled={låsKnapp}>
                    Sett på vent
                </Button>
            </KnappeWrapper>
            {feilmelding && <AlertStripe variant={'error'}>{feilmelding}</AlertStripe>}
        </SettPåVentWrapper>
    ) : null;
};
