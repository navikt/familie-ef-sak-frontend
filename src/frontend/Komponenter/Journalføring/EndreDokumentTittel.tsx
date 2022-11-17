import React, { useState } from 'react';
import styled from 'styled-components';
import CreatableSelect from 'react-select/creatable';
import { dokumentTitler } from './konstanter/dokumenttitler';
import navFarger from 'nav-frontend-core';
import { CSSObjectWithLabel, StylesConfig } from 'react-select';
import { Button } from '@navikt/ds-react';

const StyledKnapper = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-top: 0.5rem;
`;

const HovedKnapp = styled(Button)`
    margin-right: 0.25rem;
`;

const StyledWrapper = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
`;

interface OptionType {
    label: string;
    value: string;
}

const customStyles: StylesConfig = {
    container: (defaultStyles: CSSObjectWithLabel, state) => ({
        ...defaultStyles,
        backgroundColor: '#fff',
        borderRadius: 4,
        boxShadow: state.isFocused ? `0 0 0 3px ${navFarger.fokusFarge}` : '',
        border: `1px solid ${navFarger.navGra60}`,
    }),
    control: (defaultStyles: CSSObjectWithLabel) => ({
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
            <CreatableSelect
                styles={customStyles}
                placeholder="Velg tittel"
                options={dokumentTitler}
                formatCreateLabel={(val: string) => `Opprett "${val}"`}
                onChange={(value: unknown) => {
                    settNyttDokumentNavn((value as OptionType).value);
                }}
            />
            <StyledKnapper>
                <HovedKnapp
                    type="button"
                    onClick={() => {
                        props.endreDokumentNavn(nyttDokumentNavn);
                        settNyttDokumentNavn('');
                    }}
                    size={'small'}
                >
                    Lagre
                </HovedKnapp>
                <Button
                    type="button"
                    variant={'secondary'}
                    onClick={() => {
                        props.avbrytEndring();
                        settNyttDokumentNavn('');
                    }}
                    size={'small'}
                >
                    Avbryt
                </Button>
            </StyledKnapper>
        </StyledWrapper>
    );
};

export default EndreDokumentTittel;
