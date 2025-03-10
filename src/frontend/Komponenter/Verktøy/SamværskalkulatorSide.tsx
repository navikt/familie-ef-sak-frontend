import React, { useEffect, useState } from 'react';
import { Samværskalkulator } from '../../Felles/Kalkulator/Samværskalkulator';
import { Samværsandel, Samværsavtale } from '../../App/typer/samværsavtale';
import {
    oppdaterSamværsuke,
    oppdaterVarighetPåSamværsavtale,
    utledInitiellSamværsavtale,
} from '../../Felles/Kalkulator/utils';
import { useApp } from '../../App/context/AppContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import { BodyShort, Heading, HStack, Textarea, VStack } from '@navikt/ds-react';
import { Knapp } from '../../Felles/Knapper/HovedKnapp';
import styled from 'styled-components';
import { EndrePersonModal } from './EndrePersonModal';
import { byggTomRessurs, Ressurs } from '../../App/typer/ressurs';
import DataViewer from '../../Felles/DataViewer/DataViewer';

const Notat = styled(Textarea)`
    width: 40rem;
`;

export const SamværskalkulatorSide: React.FC = () => {
    return (
        <Routes>
            <Route path=":personIdent" element={<SamværskalkulatorSkjema />} />
            <Route path="/" element={<SamværskalkulatorSkjema />} />
        </Routes>
    );
};

interface PersonSøk {
    personIdent: string;
    navn: string;
}

const SamværskalkulatorSkjema: React.FC = () => {
    const initPersonIdent = useParams<{ personIdent: string | undefined }>().personIdent as string;
    const navigate = useNavigate();
    const { axiosRequest } = useApp();

    const [personIdent, settPersonIdent] = useState<string>(initPersonIdent);
    const [visEndrePersonModal, settVisEndrePersonModal] = useState<boolean>(false);

    const håndterEndrePersonModal = () => {
        settVisEndrePersonModal(true);
    };

    const [søkRessurs, settSøkRessurs] = useState(byggTomRessurs<PersonSøk>());
    useEffect(() => {
        if (personIdent && personIdent.length === 11) {
            axiosRequest<PersonSøk, { personIdent: string }>({
                method: 'POST',
                url: 'familie-ef-sak/api/sok/person/uten-fagsak',
                data: {
                    personIdent: personIdent,
                },
            }).then((resp: Ressurs<PersonSøk>) => {
                settSøkRessurs(resp);
            });
        }
    }, [axiosRequest, personIdent]);

    const { settIkkePersistertKomponent, nullstillIkkePersistertKomponent } = useApp();
    const [samværsavtale, settSamværsavtale] = useState<Samværsavtale>(
        utledInitiellSamværsavtale(undefined, '', '')
    );
    const [notat, settNotat] = useState<string>('');
    const [senderInnJournalføring, settSenderInnJournalføring] = useState<boolean>(false);

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

    const håndterJournalførSamværsavtale = () => {
        if (senderInnJournalføring) {
            return;
        }
        //TODO
        //journalførSamværsavtale()
        nullstillIkkePersistertKomponent('samværskalkulator');
        settSenderInnJournalføring(false);
    };

    const håndterNullstillSamværsavtale = () => {
        settSamværsavtale(utledInitiellSamværsavtale(undefined, '', ''));
        nullstillIkkePersistertKomponent('samværskalkulator');
    };

    return (
        <VStack gap="4">
            <Heading size="large">Samværskalkulator</Heading>
            <Knapp onClick={håndterEndrePersonModal}>Dummy Endre Person Knapp</Knapp>
            <DataViewer response={{ søkRessurs }}>
                {({ søkRessurs }) => {
                    return <BodyShort>{søkRessurs.navn}</BodyShort>;
                }}
            </DataViewer>
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
            {visEndrePersonModal && (
                <EndrePersonModal
                    settPersonIdent={settPersonIdent}
                    settVisEndrePersonModal={settVisEndrePersonModal}
                />
            )}
            <HStack gap="4">
                <Knapp size={'small'} variant={'tertiary'} onClick={() => navigate('/oppgavebenk')}>
                    Avbryt
                </Knapp>
                <Knapp
                    size={'small'}
                    variant={'primary'}
                    onClick={håndterJournalførSamværsavtale}
                    loading={senderInnJournalføring}
                    disabled={senderInnJournalføring}
                >
                    Journalfør
                </Knapp>
            </HStack>
        </VStack>
    );
};
