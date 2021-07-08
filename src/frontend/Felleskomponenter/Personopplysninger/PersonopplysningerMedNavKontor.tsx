import React from 'react';
import 'nav-frontend-tabell-style';
import InnvandringUtVandring from './InnvandringUtvandring';
import Barn from './Barn';
import Adressehistorikk from './Adressehistorikk';
import Sivilstatus from './Sivilstatus';
import Fullmakter from './Fullmakter';
import Statsborgerskap from './Statsborgerskap';
import DataViewer from '../DataViewer/DataViewer';
import Oppholdstillatelse from './Oppholdstillatelse';
import NavKontor from './NavKontor';
import { INavKontor, IPersonopplysninger } from '../../typer/personopplysninger';
import { Ressurs } from '../../typer/ressurs';

const PersonopplysningerMedNavKontor: React.FC<{
    personopplysninger: IPersonopplysninger;
    navKontor: Ressurs<INavKontor>;
}> = ({ personopplysninger, navKontor }) => {
    const {
        adresse,
        sivilstand,
        barn,
        statsborgerskap,
        folkeregisterpersonstatus,
        innflyttingTilNorge,
        utflyttingFraNorge,
        fullmakt,
        oppholdstillatelse,
    } = personopplysninger;
    return (
        <>
            <Adressehistorikk adresser={adresse} />
            <Sivilstatus sivilstander={sivilstand} />
            <Barn barn={barn} />
            <Statsborgerskap
                statsborgerskap={statsborgerskap}
                folkeregisterPersonstatus={folkeregisterpersonstatus}
            />
            <Oppholdstillatelse oppholdstillatelser={oppholdstillatelse} />
            <InnvandringUtVandring
                innvandringer={innflyttingTilNorge}
                utvandringer={utflyttingFraNorge}
            />
            <Fullmakter fullmakter={fullmakt} />

            <DataViewer response={{ navKontor }}>
                {({ navKontor }) => {
                    return <NavKontor navKontor={navKontor} />;
                }}
            </DataViewer>
        </>
    );
};

export default PersonopplysningerMedNavKontor;
