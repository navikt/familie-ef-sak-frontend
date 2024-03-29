import React, { useMemo } from 'react';
import { INavKontor, IPersonopplysninger } from '../../App/typer/personopplysninger';
import PersonopplysningerMedNavKontor from '../../Felles/Personopplysninger/PersonopplysningerMedNavKontor';
import { IPersonIdent } from '../../App/typer/felles';
import { AxiosRequestConfig } from 'axios';
import { useDataHenter } from '../../App/hooks/felles/useDataHenter';
import { IFagsakPerson } from '../../App/typer/fagsak';

const Personopplysninger: React.FC<{
    personopplysninger: IPersonopplysninger;
    fagsakPerson: IFagsakPerson;
}> = ({ personopplysninger, fagsakPerson }) => {
    const personIdent = personopplysninger.personIdent;
    const navKontorConfig: AxiosRequestConfig = useMemo(
        () => ({
            method: 'POST',
            url: `/familie-ef-sak/api/personopplysninger/nav-kontor`,
            data: { personIdent: personIdent },
        }),
        [personIdent]
    );

    const navKontor = useDataHenter<INavKontor | undefined, IPersonIdent>(navKontorConfig);

    return (
        <PersonopplysningerMedNavKontor
            personopplysninger={personopplysninger}
            navKontor={navKontor}
            fagsakPerson={fagsakPerson}
        />
    );
};

export default Personopplysninger;
