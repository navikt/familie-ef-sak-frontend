import React, { useState } from 'react';
import { Samværskalkulator } from '../../Felles/Kalkulator/Samværskalkulator';
import { Samværsandel, Samværsavtale } from '../../App/typer/samværsavtale';
import {
    oppdaterSamværsuke,
    oppdaterVarighetPåSamværsavtale,
    utledInitiellSamværsavtale,
} from '../../Felles/Kalkulator/utils';
import { useApp } from '../../App/context/AppContext';
import { Route, Routes, useParams } from 'react-router-dom';
import { EndrePersonModal } from './EndrePersonModal';
import { BrukerPanel } from '../../Felles/BrukerPanel/BrukerPanel';
import { PanelHeaderType } from '../../Felles/BrukerPanel/PanelHeader';

export interface FinnNavnHer {
    personIdent: string;
    navn: string;
}

const SamværskalkulatorMedPersonIdent: React.FC = () => {
    const personIdent = useParams<Params>().personIdent as string;
    const [finnNavnHer, settFinnNavnHer] = useState<FinnNavnHer>({
        personIdent: personIdent,
        navn: 'ok',
    });
    const [visEndrePersonModal, settVisEndrePersonModal] = useState<boolean>(false);

    const håndterEndrePersonModal = () => {
        settVisEndrePersonModal(true);
    };

    const { settIkkePersistertKomponent } = useApp();
    const [samværsavtale, settSamværsavtale] = useState<Samværsavtale>(
        utledInitiellSamværsavtale(undefined, '', '')
    );

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

    return (
        <>
            <BrukerPanel
                navn={''}
                personIdent={personIdent}
                type={PanelHeaderType.Samværsavtale}
                onClick={håndterEndrePersonModal}
            />
            <Samværskalkulator
                onSave={() => null}
                onClose={() => null}
                onDelete={() => null}
                samværsuker={samværsavtale.uker}
                oppdaterSamværsuke={håndterOppdaterSamværsuke}
                oppdaterVarighet={håndterOppdaterVarighetPåSamværsavtale}
                erLesevisning={false}
            />
            {visEndrePersonModal && (
                <EndrePersonModal
                    finnNavnHer={finnNavnHer}
                    settFinnNavnHer={settFinnNavnHer}
                    settVisBrevmottakereModal={settVisEndrePersonModal}
                />
            )}
        </>
    );
};

type Params = {
    personIdent: string | undefined;
};

export const SamværskalkulatorSide: React.FC = () => {
    return (
        <Routes>
            <Route path=":personIdent" element={<SamværskalkulatorMedPersonIdent />} />
            <Route
                path="/"
                element={
                    <Samværskalkulator
                        onSave={() => null}
                        onClose={() => null}
                        onDelete={() => null}
                        samværsuker={[]}
                        oppdaterSamværsuke={() => null}
                        oppdaterVarighet={() => null}
                        erLesevisning={false}
                    />
                }
            />
        </Routes>
    );
};
