import React, { useMemo } from 'react';
import { INavKontor, IPersonopplysninger } from '../typer/personopplysninger';
import PersonopplysningerMedNavKontor from '../Felleskomponenter/Personopplysninger/PersonopplysningerMedNavKontor';
import { IPersonIdent } from '../typer/felles';
import { AxiosRequestConfig } from 'axios';
import { useDataHenter } from '../hooks/felles/useDataHenter';

const Personopplysninger: React.FC<{ personopplysninger: IPersonopplysninger }> = ({
    personopplysninger,
}) => {
    const personIdent = personopplysninger.personIdent;
    const navKontorConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'POST',
            url: `/familie-ef-sak/api/personopplysninger/nav-kontor`,
            data: { personIdent: personIdent },
        }),
        [personIdent]
    );
    const navKontor = useDataHenter<INavKontor, IPersonIdent>(navKontorConfig);

    return (
        <PersonopplysningerMedNavKontor
            personopplysninger={personopplysninger}
            navKontor={navKontor}
        />
    );
};
export default Personopplysninger;
