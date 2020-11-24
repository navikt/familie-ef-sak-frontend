import React, { useEffect } from 'react';
import 'nav-frontend-tabell-style';
import { useHentPersonopplysninger } from '../../../hooks/useHentPersonopplysninger';
import InnvandringUtVandring from './InnvandringUtvandring';
import Barn from './Barn';
import Adressehistorikk from './Adressehistorikk';
import Sivilstatus from './Sivilstatus';
import Fullmakter from './Fullmakter';
import Statsborgerskap from './Statsborgerskap';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';

const Personopplysninger: React.FC<{ behandlingId: string }> = ({ behandlingId }) => {
    const { hentPersonopplysninger, personopplysningerResponse } = useHentPersonopplysninger();

    useEffect(() => {
        hentPersonopplysninger(behandlingId);
    }, [behandlingId]);

    return (
        <DataViewer response={personopplysningerResponse}>
            {(data) => {
                const {
                    adresse,
                    sivilstand,
                    barn,
                    statsborgerskap,
                    folkeregisterpersonstatus,
                    innflyttingTilNorge,
                    utflyttingFraNorge,
                    fullmakt,
                } = data;
                return (
                    <>
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
            }}
        </DataViewer>
    );
};

export default Personopplysninger;
