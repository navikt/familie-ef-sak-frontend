import { Hovedknapp, Knapp } from 'nav-frontend-knapper';
import React, { useState } from 'react';
import styled from 'styled-components';
import CreatableSelect from 'react-select/creatable';
import { dokumentTitler } from './konstanter/dokumenttitler';
import { styles } from '../../typer/styles';

const StyledKnapper = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 0.5rem;
`;

const StyledHovedKnapp = styled(Hovedknapp)`
    margin-right: 0.25rem;
`;

const StyledDiv = styled.div`
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
        boxShadow: state.isFocused ? `0 0 0 3px ${styles.farger.fokusFarge}` : '',
        border: `1px solid ${styles.farger.navGra60}`,
    }),
    control: (defaultStyles: Record<string, string>) => ({
        ...defaultStyles,
        borderColor: styles.farger.navGra40,
        outline: 'none',
        border: 'none',
        backgroundColor: '#fff',
        ':hover': {
            borderColor: styles.farger.navBla,
        },
    }),
};

const EndreDokumentTittel: React.FC<{
    endreDokumentNavn: (nyttDokumentNavn: string) => void;
    avbrytEndring: () => void;
}> = (props) => {
    const [nyttDokumentNavn, settNyttDokumentNavn] = useState('');

    return (
        <StyledDiv>
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
        </StyledDiv>
    );
};

export default EndreDokumentTittel;
