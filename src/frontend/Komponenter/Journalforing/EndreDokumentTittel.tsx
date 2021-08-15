import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import React, { useState } from 'react';
import styled from 'styled-components';
import CreatableSelect from 'react-select/creatable';
import { dokumentTitler } from './konstanter/dokumenttitler';
import navFarger from 'nav-frontend-core';

const StyledKnapper = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 0.5rem;
`;

const StyledHovedKnapp = styled(Hovedknapp)`
    margin-right: 0.25rem;
`;

const StyledWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

const StyledCreatableSelect = styled(CreatableSelect)``;

const customStyles = {
    container: (defaultStyles: Record<string, string>, state: Record<string, string>) => ({
        ...defaultStyles,
        backgroundColor: '#fff',
        borderRadius: 4,
        boxShadow: state.isFocused ? `0 0 0 3px ${navFarger.fokusFarge}` : '',
        border: `1px solid ${navFarger.navGra60}`,
    }),
    control: (defaultStyles: Record<string, string>) => ({
        ...defaultStyles,
        borderColor: navFarger.navGra40,
        outline: 'none',
        border: 'none',
        backgroundColor: '#fff',
        ':hover': {
            borderColor: navFarger.navBla,
        },
    }),
};

const EndreDokumentTittel: React.FC<{
    endreDokumentNavn: (nyttDokumentNavn: string) => void;
    avbrytEndring: () => void;
}> = (props) => {
    const [nyttDokumentNavn, settNyttDokumentNavn] = useState('');

    return (
        <StyledWrapper>
            <StyledCreatableSelect
                styles={customStyles}
                placeholder="Velg tittel"
                options={dokumentTitler}
                formatCreateLabel={(val: string) => `Opprett "${val}"`}
                onChange={(option: { label: string; value: string }) =>
                    settNyttDokumentNavn(option.value)
                }
            />
            <StyledKnapper>
                <StyledHovedKnapp
                    kompakt
                    onClick={() => {
                        props.endreDokumentNavn(nyttDokumentNavn);
                        settNyttDokumentNavn('');
                    }}
                >
                    Lagre
                </StyledHovedKnapp>
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
        </StyledWrapper>
    );
};

export default EndreDokumentTittel;
