import { Knapp } from 'nav-frontend-knapper';
import React, { useState } from 'react';
import styled from 'styled-components';
import CreatableSelect from 'react-select/creatable';
import { dokumentTitler } from './TittelConfig';

const StyledKnapper = styled.div``;

const StyledCreatableSelect = styled(CreatableSelect)`
    width: 20rem;
`;

const EndreDokumentTittel: React.FC<{
    endreDokumentNavn: (nyttDokumentNavn: string) => void;
    avbrytEndring: () => void;
}> = (props) => {
    const [nyttDokumentNavn, settNyttDokumentNavn] = useState('');

    return (
        <>
            <StyledCreatableSelect
                placeholder="Velg tittel"
                options={dokumentTitler}
                formatCreateLabel={(val: string) => `Opprett "${val}"`}
                onChange={(option: any) => {
                    settNyttDokumentNavn(option.value);
                }}
            />
            <StyledKnapper>
                <Knapp
                    kompakt
                    onClick={() => {
                        props.endreDokumentNavn(nyttDokumentNavn);
                        settNyttDokumentNavn('');
                    }}
                >
                    Lagre
                </Knapp>
                <Knapp
                    kompakt
                    onClick={() => {
                        props.avbrytEndring();
                        settNyttDokumentNavn('');
                    }}
                >
                    Avbryt
                </Knapp>
            </StyledKnapper>
        </>
    );
};

export default EndreDokumentTittel;
