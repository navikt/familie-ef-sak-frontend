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
import { BrukerPanel } from '../../Felles/BrukerPanel/BrukerPanel';
import { PanelHeaderType } from '../../Felles/BrukerPanel/PanelHeader';

const SamværskalkulatorMedPersonIdent: React.FC = () => {
    const personIdent = useParams<Params>().personIdent as string;
    console.log(personIdent);

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
                personIdent={''}
                type={PanelHeaderType.Samværsavtale}
            ></BrukerPanel>
            <Samværskalkulator
                onSave={() => null}
                onClose={() => null}
                onDelete={() => null}
                samværsuker={samværsavtale.uker}
                oppdaterSamværsuke={håndterOppdaterSamværsuke}
                oppdaterVarighet={håndterOppdaterVarighetPåSamværsavtale}
                erLesevisning={false}
            />
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
