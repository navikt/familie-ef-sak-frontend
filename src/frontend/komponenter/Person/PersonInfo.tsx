import React, { useState } from 'react';
import { Knapp } from 'nav-frontend-knapper';
import InputMedLabelTilVenstre from '../Felleskomponenter/InputMedLabelTilVenstre/InputMedLabelTilVenstre';
import { hentPersoninfo } from '../../api/personinfo';

const PersonInfo = () => {
    const [personinput, settPersoninput] = useState<string>('');
    const [persondata, settPersondata] = useState<string>('');

    return (
        <>
            <InputMedLabelTilVenstre
                bredde={'S'}
                label={'Finn person'}
                value={personinput}
                type={'string'}
                onChange={event => {
                    settPersoninput(event.target.value);
                }}
            />
            <Knapp
                onClick={() => {
                    hentPersoninfo(personinput).then(response => {
                        settPersondata(JSON.stringify(response));
                    });
                }}
            >
                Finn person
            </Knapp>

            <p>{persondata}</p>
        </>
    );
};

export default PersonInfo;
