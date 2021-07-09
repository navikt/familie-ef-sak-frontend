import React from 'react';
import 'nav-frontend-tabell-style';
import { useBehandling } from '../../context/BehandlingContext';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import PersonopplysningerMedNavKontor from '../../Felleskomponenter/Personopplysninger/PersonopplysningerMedNavKontor';

const Personopplysninger: React.FC = () => {
    const { personopplysningerResponse, navKontorResponse } = useBehandling();

    return (
        <DataViewer response={{ personopplysningerResponse }}>
            {({ personopplysningerResponse }) => (
                <PersonopplysningerMedNavKontor
                    personopplysninger={personopplysningerResponse}
                    navKontor={navKontorResponse}
                />
            )}
        </DataViewer>
    );
};

export default Personopplysninger;
