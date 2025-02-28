import React from 'react';
import { Samværskalkulator } from '../../Felles/Kalkulator/Samværskalkulator';
import { useParams } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';

const SamværskalkulatorMedPersonIdent: React.FC = () => {
    const personIdent = useParams<Params>().personIdent as string;
    console.log(personIdent);

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
