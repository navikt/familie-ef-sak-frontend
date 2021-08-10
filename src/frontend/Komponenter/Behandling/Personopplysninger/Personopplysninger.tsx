import React from 'react';
import 'nav-frontend-tabell-style';
import { useBehandling } from '../../../App/context/BehandlingContext';
import DataViewer from '../../../Felles/DataViewer/DataViewer';
import PersonopplysningerMedNavKontor from '../../../Felles/Personopplysninger/PersonopplysningerMedNavKontor';

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
