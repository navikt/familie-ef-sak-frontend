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
import { INavKontor, IPersonopplysninger } from '../../App/typer/personopplysninger';
import { Ressurs } from '../../App/typer/ressurs';
import Vergemål from './Vergemål';
import styled from 'styled-components';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 2rem;
`;

const PersonopplysningerMedNavKontor: React.FC<{
    personopplysninger: IPersonopplysninger;
    navKontor: Ressurs<INavKontor | undefined>;
    fagsakPersonId: string;
}> = ({ personopplysninger, navKontor, fagsakPersonId }) => {
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
        vergemål,
    } = personopplysninger;
    return (
        <Container>
            <Adressehistorikk adresser={adresse} fagsakPersonId={fagsakPersonId} />
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
            <Vergemål vergemål={vergemål} />

            <DataViewer response={{ navKontor }}>
                {({ navKontor }) => {
                    return <NavKontor navKontor={navKontor} />;
                }}
            </DataViewer>
        </Container>
    );
};

export default PersonopplysningerMedNavKontor;
