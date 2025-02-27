import React from 'react';
import { Samværskalkulator } from '../../Felles/Kalkulator/Samværskalkulator';

interface Props {
    prop: string;
}

export const SamværskalkulatorSide: React.FC<Props> = () => {
    return (
        <Samværskalkulator
            onSave={() => null}
            onClose={() => null}
            onDelete={() => null}
            samværsuker={[]}
            oppdaterSamværsuke={() => null}
            oppdaterVarighet={() => null}
            erLesevisning={false}
        />
    );
};
