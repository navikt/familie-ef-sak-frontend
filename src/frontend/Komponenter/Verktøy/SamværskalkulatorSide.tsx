import React, { useState } from 'react';
import { Samværskalkulator } from '../../Felles/Kalkulator/Samværskalkulator';
import { Samværsandel, Samværsavtale } from '../../App/typer/samværsavtale';
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

const SamværskalkulatorSkjema: React.FC = () => {
    const personIdent = useParams<{ personIdent: string | undefined }>().personIdent as string;
    const navigate = useNavigate();
    console.log('ident', personIdent);

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
            <BrukerPanel
                navn={''}
                personIdent={''}
                type={PanelHeaderType.Samværsavtale}
            ></BrukerPanel>
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
