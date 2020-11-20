import React, { useEffect } from 'react';
import 'nav-frontend-tabell-style';
import { useHentPersonopplysninger } from '../../../hooks/useHentPersonopplysninger';
import { RessursStatus } from '../../../typer/ressurs';
import InnvandringUtVandring from './InnvandringUtvandring';
import Barn from './Barn';
import Adressehistorikk from './Adressehistorikk';
import Sivilstatus from './Sivilstatus';
import Fullmakter from './Fullmakter';
import Statsborgerskap from './Statsborgerskap';
import { PersonopplysningerHeader } from './PersonopplysningerHeader';

const Personopplysninger: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { hentPersonopplysninger, personopplysningerResponse } = useHentPersonopplysninger();

    useEffect(() => {
        hentPersonopplysninger(behandlingId);
    }, [behandlingId]);

    if (personopplysningerResponse.status === RessursStatus.SUKSESS) {
        const {
            adresse,
            sivilstand,
            barn,
            statsborgerskap,
            folkeregisterpersonstatus,
            innflyttingTilNorge,
            utflyttingFraNorge,
            fullmakt,
            telefonnummer,
            navEnhet,
        } = personopplysningerResponse.data;
        return (
            <>
                <PersonopplysningerHeader telefon={telefonnummer} navEnhet={navEnhet} />
                <Adressehistorikk adresser={adresse} />
                <Sivilstatus sivilstander={sivilstand} />
                <Barn barn={barn} />
                <Statsborgerskap
                    statsborgerskap={statsborgerskap}
                    folkeregisterPersonstatus={folkeregisterpersonstatus}
                />
                <InnvandringUtVandring
                    innvandringer={innflyttingTilNorge}
                    utvandringer={utflyttingFraNorge}
                />
                <Fullmakter fullmakter={fullmakt} />
            </>
        );
    } else {
        return <></>;
    }
};

export default Personopplysninger;
