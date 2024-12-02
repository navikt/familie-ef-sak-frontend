import React, { FC, useState } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Ressurs, RessursStatus } from '../../../App/typer/ressurs';
import { Behandling } from '../../../App/typer/fagsak';
import { useApp } from '../../../App/context/AppContext';
import { EToast } from '../../../App/typer/toast';
import { EHenlagtårsak } from '../../../App/typer/behandlingsårsak';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { Alert, Radio, RadioGroup } from '@navikt/ds-react';
import styled from 'styled-components';
import { useRedirectEtterLagring } from '../../../App/hooks/felles/useRedirectEtterLagring';
import { v4 as uuidv4 } from 'uuid';
import { useToggles } from '../../../App/context/TogglesContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { AnsvarligSaksbehandlerRolle } from '../../../App/typer/saksbehandler';
import { ToggleName } from '../../../App/context/toggles';
import { Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { Link } from '@navikt/ds-react';

const AlertStripe = styled(Alert)`
    margin-top: 1rem;
`;

const TillegsValg = styled.div`
    display: flex;
    flex-direction: column;
`;

export const HenleggModal: FC<{ behandling: Behandling }> = ({ behandling }) => {
    const {
        visHenleggModal,
        settVisHenleggModal,
        hentAnsvarligSaksbehandler,
        ansvarligSaksbehandler,
    } = useBehandling();
    const { toggles } = useToggles();
    const { utførRedirect } = useRedirectEtterLagring(`/fagsak/${behandling.fagsakId}`);
    const {
        axiosRequest,
        settToast,
        nullstillIkkePersisterteKomponenter,
        settIkkePersistertKomponent,
    } = useApp();
    const [henlagtårsak, settHenlagtårsak] = useState<EHenlagtårsak>();
    const [sendHenleggelsesbrev, settSendHenleggelsesbrev] = useState(['Send henleggelsesbrev']);
    const [låsKnapp, settLåsKnapp] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();

    const utledEndepunktForHenleggelse = (rolle: AnsvarligSaksbehandlerRolle) =>
        toggles[ToggleName.henleggBehandlingUtenÅHenleggeOppgave] &&
        rolle === AnsvarligSaksbehandlerRolle.OPPGAVE_TILHØRER_IKKE_ENF
            ? `/familie-ef-sak/api/behandling/${behandling.id}/henlegg/behandling-uten-oppgave`
            : `/familie-ef-sak/api/behandling/${behandling.id}/henlegg`;

    const lagreHenleggelse = (ansvarligSaksbehandlerRolle: AnsvarligSaksbehandlerRolle) => {
        if (!henlagtårsak) {
            settFeilmelding('Du må velge en henleggelsesårsak');
        }

        if (låsKnapp || !henlagtårsak) {
            return;
        }
        settLåsKnapp(true);
        nullstillIkkePersisterteKomponenter();

        const endepunkt = utledEndepunktForHenleggelse(ansvarligSaksbehandlerRolle);

        axiosRequest<string, { årsak: EHenlagtårsak }>({
            method: 'POST',
            url: endepunkt,
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
        console.log(sendHenleggelsesbrev);
    };

    return (
        <DataViewer response={{ ansvarligSaksbehandler }}>
            {({ ansvarligSaksbehandler }) => {
                return (
                    <ModalWrapper
                        tittel={'Henlegg'}
                        visModal={visHenleggModal}
                        onClose={() => lukkModal()}
                        aksjonsknapper={{
                            hovedKnapp: {
                                onClick: () => lagreHenleggelse(ansvarligSaksbehandler.rolle),
                                tekst: 'Henlegg',
                                disabled: låsKnapp,
                            },
                            lukkKnapp: { onClick: () => lukkModal(), tekst: 'Avbryt' },
                        }}
                        ariaLabel={'Velg årsak til henleggelse av behandlingen'}
                    >
                        <RadioGroup
                            legend={''}
                            onChange={(årsak: EHenlagtårsak) => settHenlagtårsak(årsak)}
                        >
                            <Radio value={EHenlagtårsak.TRUKKET_TILBAKE}>Trukket tilbake</Radio>
                            <Radio value={EHenlagtårsak.FEILREGISTRERT}>Feilregistrert</Radio>
                        </RadioGroup>
                        {henlagtårsak === EHenlagtårsak.TRUKKET_TILBAKE && (
                            <TillegsValg>
                                <CheckboxGroup
                                    legend="Send henleggelsesbrev"
                                    hideLegend
                                    onChange={settSendHenleggelsesbrev}
                                    value={sendHenleggelsesbrev}
                                >
                                    <Checkbox value="Send henleggelsesbrev">
                                        Send henleggelsesbrev
                                    </Checkbox>
                                </CheckboxGroup>
                                <Link href="#">Forhåndsvis brev</Link>
                            </TillegsValg>
                        )}
                        {feilmelding && <AlertStripe variant={'error'}>{feilmelding}</AlertStripe>}
                    </ModalWrapper>
                );
            }}
        </DataViewer>
    );
};
