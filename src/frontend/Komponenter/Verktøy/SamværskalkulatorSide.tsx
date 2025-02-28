import React, { useState } from 'react';
import { Samværskalkulator } from '../../Felles/Kalkulator/Samværskalkulator';
import { Samværsandel, Samværsavtale } from '../../App/typer/samværsavtale';
import { initerSamværsuker, utledInitiellSamværsavtale } from '../../Felles/Kalkulator/utils';
import { useApp } from '../../App/context/AppContext';

interface Props {
    prop: string;
}

export const SamværskalkulatorSide: React.FC<Props> = () => {
    const { settIkkePersistertKomponent } = useApp();
    const [samværsavtale, settSamværsavtale] = useState<Samværsavtale>(
        utledInitiellSamværsavtale(undefined, '', '')
    );

    const oppdaterSamværsuke = (
        ukeIndex: number,
        ukedag: string,
        samværsandeler: Samværsandel[]
    ) => {
        settIkkePersistertKomponent('samværskalkulator');
        settSamværsavtale((prevState) => ({
            ...prevState,
            uker: [
                ...prevState.uker.slice(0, ukeIndex),
                { ...prevState.uker[ukeIndex], [ukedag]: { andeler: samværsandeler } },
                ...prevState.uker.slice(ukeIndex + 1),
            ],
        }));
    };

    const oppdaterVarighetPåSamværsavtale = (nyVarighet: number) => {
        settIkkePersistertKomponent('samværskalkulator');

        const nåværendeVarighet = samværsavtale.uker.length;

        if (nyVarighet > nåværendeVarighet) {
            settSamværsavtale((prevState) => ({
                ...prevState,
                uker: [
                    ...prevState.uker.slice(0, nåværendeVarighet),
                    ...initerSamværsuker(nyVarighet - nåværendeVarighet),
                ],
            }));
        } else {
            settSamværsavtale((prevState) => ({
                ...prevState,
                uker: prevState.uker.slice(0, nyVarighet),
            }));
        }
    };

    return (
        <Samværskalkulator
            onSave={() => null}
            onClose={() => null}
            onDelete={() => null}
            samværsuker={samværsavtale.uker}
            oppdaterSamværsuke={oppdaterSamværsuke}
            oppdaterVarighet={oppdaterVarighetPåSamværsavtale}
            erLesevisning={false}
        />
    );
};
