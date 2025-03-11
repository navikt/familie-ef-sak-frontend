import React, { useEffect, useState } from 'react';
import { Samværskalkulator } from '../../Felles/Kalkulator/Samværskalkulator';
import {
    JournalførBeregnetSamværRequest,
    Samværsandel,
    Samværsavtale,
} from '../../App/typer/samværsavtale';
import {
    oppdaterSamværsuke,
    oppdaterVarighetPåSamværsavtale,
    utledInitiellSamværsavtale,
} from '../../Felles/Kalkulator/utils';
import { useApp } from '../../App/context/AppContext';
import { Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { Heading, HStack, Textarea, VStack } from '@navikt/ds-react';
import { Knapp } from '../../Felles/Knapper/HovedKnapp';
import styled from 'styled-components';
import { BrukerPanel } from '../../Felles/BrukerPanel/BrukerPanel';
import { PanelHeaderType } from '../../Felles/BrukerPanel/PanelHeader';
import { OppdaterPersonModal } from './OppdaterPersonModal';
import {
    byggSuksessRessurs,
    byggTomRessurs,
    Ressurs,
    RessursStatus,
} from '../../App/typer/ressurs';
import DataViewer from '../../Felles/DataViewer/DataViewer';
import { PersonSøk } from '../Behandling/Brevmottakere/SøkPerson';
import { useSamværsavtaler } from '../../App/hooks/useSamværsavtaler';
import { AlertError } from '../../Felles/Visningskomponenter/Alerts';

const Notat = styled(Textarea)`
    width: 40rem;
`;

const StyledBrukerPanel = styled(BrukerPanel)`
    width: max-content;
`;

export const SamværskalkulatorSide: React.FC = () => (
    <Routes>
        <Route path=":personIdent" element={<SamværskalkulatorSkjema />} />
        <Route path="/" element={<SamværskalkulatorSkjema />} />
    </Routes>
);

const SamværskalkulatorSkjema: React.FC = () => {
    const initiellPersonIdent = useParams<{ personIdent: string }>().personIdent as string;
    const navigate = useNavigate();
    const { axiosRequest, settIkkePersistertKomponent, nullstillIkkePersistertKomponent } =
        useApp();
    const { journalførBeregnetSamvær } = useSamværsavtaler();

    const [visEndrePersonModal, settVisEndrePersonModal] = useState<boolean>(false);
    const [søkRessurs, settSøkRessurs] = useState(
        initiellPersonIdent
            ? byggTomRessurs<PersonSøk>()
            : byggSuksessRessurs<PersonSøk>({ personIdent: '', navn: '' })
    );
    const [samværsavtale, settSamværsavtale] = useState<Samværsavtale>(
        utledInitiellSamværsavtale(undefined, '', '')
    );
    const [notat, settNotat] = useState<string>('');
    const [senderInnJournalføring, settSenderInnJournalføring] = useState<boolean>(false);
    const [feilmelding, settFeilmelding] = useState<string>('');

    useEffect(() => {
        if (initiellPersonIdent && initiellPersonIdent.length === 11) {
            axiosRequest<PersonSøk, { personIdent: string }>({
                method: 'POST',
                url: 'familie-ef-sak/api/sok/person/uten-fagsak',
                data: {
                    personIdent: initiellPersonIdent,
                },
            }).then((resp: Ressurs<PersonSøk>) => {
                settSøkRessurs(resp);
            });
        }
    }, [axiosRequest, initiellPersonIdent]);

    const oppdaterPerson = (personIdent: string, navn: string) => {
        settSøkRessurs({
            status: RessursStatus.SUKSESS,
            data: { personIdent, navn },
        });
    };

    const håndterOppdaterSamværsuke = (
        ukeIndex: number,
        ukedag: string,
        samværsandeler: Samværsandel[]
    ) => {
        settIkkePersistertKomponent('samværskalkulator');
        oppdaterSamværsuke(ukeIndex, ukedag, samværsandeler, settSamværsavtale);
    };

    const håndterOppdaterVarighetPåSamværsavtale = (nyVarighet: number) => {
        settIkkePersistertKomponent('samværskalkulator');
        oppdaterVarighetPåSamværsavtale(samværsavtale.uker.length, nyVarighet, settSamværsavtale);
    };

    const håndterJournalførSamværsavtale = (personIdent: string) => {
        settFeilmelding('');

        if (senderInnJournalføring) {
            return;
        }

        if (personIdent.length !== 11) {
            settFeilmelding('Ugyldig fødselsnummer');
            return;
        }

        const request: JournalførBeregnetSamværRequest = {
            personIdent: personIdent,
            uker: samværsavtale.uker,
            notat: notat,
        };

        journalførBeregnetSamvær(request);

        nullstillIkkePersistertKomponent('samværskalkulator');
        settSenderInnJournalføring(false);
    };

    const håndterNullstillSamværsavtale = () => {
        settSamværsavtale(utledInitiellSamværsavtale(undefined, '', ''));
        nullstillIkkePersistertKomponent('samværskalkulator');
    };

    const håndterEndrePersonModal = () => {
        settVisEndrePersonModal(true);
    };

    return (
        <DataViewer response={{ søkRessurs }}>
            {({ søkRessurs }) => {
                return (
                    <VStack gap="4">
                        <Heading size="large">Beregn samvær</Heading>
                        <StyledBrukerPanel
                            navn={søkRessurs.navn}
                            personIdent={søkRessurs.personIdent}
                            type={PanelHeaderType.Samværsavtale}
                            width="max-content"
                            onClick={håndterEndrePersonModal}
                        />
                        <Samværskalkulator
                            onDelete={håndterNullstillSamværsavtale}
                            samværsuker={samværsavtale.uker}
                            oppdaterSamværsuke={håndterOppdaterSamværsuke}
                            oppdaterVarighet={håndterOppdaterVarighetPåSamværsavtale}
                            erLesevisning={false}
                        />
                        <Notat
                            label={'Notat'}
                            value={notat}
                            onChange={(e) => settNotat(e.target.value)}
                            maxLength={0}
                        />
                        <HStack gap="4">
                            <Knapp
                                size={'small'}
                                variant={'tertiary'}
                                onClick={() => navigate('/oppgavebenk')}
                            >
                                Avbryt
                            </Knapp>
                            <Knapp
                                size={'small'}
                                variant={'primary'}
                                onClick={() =>
                                    håndterJournalførSamværsavtale(søkRessurs.personIdent)
                                }
                                loading={senderInnJournalføring}
                                disabled={senderInnJournalføring}
                            >
                                Journalfør
                            </Knapp>
                        </HStack>
                        {feilmelding && <AlertError>{feilmelding}</AlertError>}
                        {visEndrePersonModal && (
                            <OppdaterPersonModal
                                oppdaterPerson={oppdaterPerson}
                                lukkModal={() => settVisEndrePersonModal(false)}
                            />
                        )}
                    </VStack>
                );
            }}
        </DataViewer>
    );
};
