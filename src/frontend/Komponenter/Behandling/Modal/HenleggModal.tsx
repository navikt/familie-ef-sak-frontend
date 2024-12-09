import React, { FC, useState } from 'react';
import { useBehandling } from '../../../App/context/BehandlingContext';
import { Ressurs, RessursFeilet, RessursStatus, RessursSuksess } from '../../../App/typer/ressurs';
import { Behandling } from '../../../App/typer/fagsak';
import { useApp } from '../../../App/context/AppContext';
import { EToast } from '../../../App/typer/toast';
import { EHenlagtårsak } from '../../../App/typer/behandlingsårsak';
import { ModalWrapper } from '../../../Felles/Modal/ModalWrapper';
import { Alert, Link, Radio, RadioGroup } from '@navikt/ds-react';
import styled from 'styled-components';
import { useRedirectEtterLagring } from '../../../App/hooks/felles/useRedirectEtterLagring';
import { v4 as uuidv4 } from 'uuid';
import { useToggles } from '../../../App/context/TogglesContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import { AnsvarligSaksbehandlerRolle } from '../../../App/typer/saksbehandler';
import { ToggleName } from '../../../App/context/toggles';
import { base64toBlob, åpnePdfIEgenTab } from '../../../App/utils/utils';
import { ABorderSubtle } from '@navikt/ds-tokens/dist/tokens';
import { VStack, Stack } from '@navikt/ds-react';

const AlertStripe = styled(Alert)`
    margin-top: 1rem;
`;

const HorizontalDivider = styled.div`
    border-bottom: 2px solid ${ABorderSubtle};
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
    const [huketAvSendBrev, settHuketAvSendBrev] = useState<boolean>(true);
    const [låsKnapp, settLåsKnapp] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const [forhåndsvisningsFeil, settForhåndsvisningsFeil] = useState<string>();

    const visBrevINyFane = () => {
        axiosRequest<string, null>({
            method: 'GET',
            url: `familie-ef-sak/api/behandling/${behandling.id}/henlegg/brev`,
        }).then((respons: RessursSuksess<string> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                åpnePdfIEgenTab(
                    base64toBlob(respons.data, 'application/pdf'),
                    'Forhåndsvisning av varselbrev'
                );
            } else {
                settForhåndsvisningsFeil(respons.frontendFeilmelding);
                console.log(forhåndsvisningsFeil);
            }
        });
    };

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

        axiosRequest<string, { årsak: EHenlagtårsak; skalSendeHenleggelsesbrev: boolean }>({
            method: 'POST',
            url: endepunkt,
            data: {
                årsak: henlagtårsak,
                skalSendeHenleggelsesbrev: skalSendeHenleggelsesBrev,
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
        settHenlagtårsak(undefined);
    };

    const skalSendeHenleggelsesBrev =
        huketAvSendBrev && henlagtårsak === EHenlagtårsak.TRUKKET_TILBAKE;

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
                        <VStack gap="4">
                            <RadioGroup
                                legend={''}
                                onChange={(årsak: EHenlagtårsak) => settHenlagtårsak(årsak)}
                            >
                                <Radio value={EHenlagtårsak.TRUKKET_TILBAKE}>Trukket tilbake</Radio>
                                <Radio value={EHenlagtårsak.FEILREGISTRERT}>Feilregistrert</Radio>
                            </RadioGroup>
                            {henlagtårsak === EHenlagtårsak.TRUKKET_TILBAKE && (
                                <>
                                    <HorizontalDivider />
                                    <RadioGroup
                                        legend="Send henleggelsesbrev"
                                        value={huketAvSendBrev}
                                    >
                                        <Stack
                                            gap="0 6"
                                            direction={{ xs: 'column', sm: 'row' }}
                                            wrap={false}
                                        >
                                            <Radio
                                                value={true}
                                                onChange={() => {
                                                    settHuketAvSendBrev(true);
                                                }}
                                            >
                                                Ja
                                            </Radio>
                                            <Radio
                                                value={false}
                                                onChange={() => settHuketAvSendBrev(false)}
                                            >
                                                Nei
                                            </Radio>
                                        </Stack>
                                    </RadioGroup>
                                    <Link onClick={visBrevINyFane}>Forhåndsvis brev</Link>
                                </>
                            )}
                            {feilmelding && (
                                <AlertStripe variant={'error'}>{feilmelding}</AlertStripe>
                            )}
                            {forhåndsvisningsFeil && (
                                <AlertStripe variant={'error'}>{forhåndsvisningsFeil}</AlertStripe>
                            )}
                        </VStack>
                    </ModalWrapper>
                );
            }}
        </DataViewer>
    );
};
