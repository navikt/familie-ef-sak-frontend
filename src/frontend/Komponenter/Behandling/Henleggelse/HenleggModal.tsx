import React, { FC, useState } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { Behandling } from '../../../App/typer/fagsak';
import { useApp } from '../../../App/context/AppContext';
import { EToast } from '../../../App/typer/toast';
import { EHenlagtårsak } from '../../../App/typer/Behandlingsårsak';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { Alert, Radio, RadioGroup } from '@navikt/ds-react';
import styled from 'styled-components';
import { useRedirectEtterLagring } from '../../../App/hooks/felles/useRedirectEtterLagring';
import { v4 as uuidv4 } from 'uuid';

const AlertStripe = styled(Alert)`
    margin-top: 1rem;
`;

export const HenleggModal: FC<{ behandling: Behandling }> = ({ behandling }) => {
    const { visHenleggModal, settVisHenleggModal, hentAnsvarligSaksbehandler } = useBehandling();
    const { utførRedirect } = useRedirectEtterLagring(`/fagsak/${behandling.fagsakId}`);
    const {
        axiosRequest,
        settToast,
        nullstillIkkePersisterteKomponenter,
        settIkkePersistertKomponent,
    } = useApp();
    const [henlagtårsak, settHenlagtårsak] = useState<EHenlagtårsak>();
    const [låsKnapp, settLåsKnapp] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();

    const lagreHenleggelse = () => {
        if (!henlagtårsak) {
            settFeilmelding('Du må velge en henleggelsesårsak');
        }

        if (låsKnapp || !henlagtårsak) {
            return;
        }
        settLåsKnapp(true);
        nullstillIkkePersisterteKomponenter();
        axiosRequest<string, { årsak: EHenlagtårsak }>({
            method: 'POST',
            url: `/familie-ef-sak/api/behandling/${behandling.id}/henlegg`,
            data: {
                årsak: henlagtårsak,
            },
        })
            .then((respons: Ressurs<string>) => {
                switch (respons.status) {
                    case RessursStatus.SUKSESS:
                        utførRedirect();
                        settToast(EToast.BEHANDLING_HENLAGT);
                        break;
                    case RessursStatus.HENTER:
                    case RessursStatus.IKKE_HENTET:
                        break;
                    default:
                        settIkkePersistertKomponent(uuidv4());
                        settFeilmelding(respons.frontendFeilmelding);
                        hentAnsvarligSaksbehandler.rerun();
                }
            })
            .finally(() => settLåsKnapp(false));
    };

    const lukkModal = () => {
        settFeilmelding('');
        settVisHenleggModal(false);
    };

    return (
        <ModalWrapper
            tittel={'Henlegg'}
            visModal={visHenleggModal}
            onClose={() => lukkModal()}
            aksjonsknapper={{
                hovedKnapp: {
                    onClick: () => lagreHenleggelse(),
                    tekst: 'Henlegg',
                    disabled: låsKnapp,
                },
                lukkKnapp: { onClick: () => lukkModal(), tekst: 'Avbryt' },
            }}
            ariaLabel={'Velg årsak til henleggelse av behandlingen'}
        >
            <RadioGroup legend={''} onChange={(årsak: EHenlagtårsak) => settHenlagtårsak(årsak)}>
                <Radio value={EHenlagtårsak.TRUKKET_TILBAKE}>Trukket tilbake</Radio>
                <Radio value={EHenlagtårsak.FEILREGISTRERT}>Feilregistrert</Radio>
            </RadioGroup>
            {feilmelding && <AlertStripe variant={'error'}>{feilmelding}</AlertStripe>}
        </ModalWrapper>
    );
};
