import React from 'react';
import 'nav-frontend-tabell-style';
import InnvandringUtVandring from './InnvandringUtvandring';
import Barn from './Barn';
import Adressehistorikk from './Adressehistorikk';
import Sivilstatus from './Sivilstatus';
import Fullmakter from './Fullmakter';
import Statsborgerskap from './Statsborgerskap';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import Oppholdstillatelse from './Oppholdstillatelse';
import { useBehandling } from '../../../context/BehandlingContext';
import NavKontor from './NavKontor';

const Personopplysninger: React.FC = () => {
    const { personopplysningerResponse, navKontorResponse } = useBehandling();

    return (
        <DataViewer response={{ personopplysningerResponse }}>
            {({ personopplysningerResponse }) => {
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
                } = personopplysningerResponse;
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

                        <DataViewer response={{ navKontorResponse }}>
                            {({ navKontorResponse }) => {
                                return <NavKontor navKontor={navKontorResponse} />;
                            }}
                        </DataViewer>
                    </>
                );
            }}
        </DataViewer>
    );
};

export default Personopplysninger;
