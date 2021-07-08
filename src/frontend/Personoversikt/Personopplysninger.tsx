import React, { useEffect, useState } from 'react';
import { INavKontor, IPersonopplysninger } from '../typer/personopplysninger';
import PersonopplysningerMedNavKontor from '../Felleskomponenter/Personopplysninger/PersonopplysningerMedNavKontor';
import { byggTomRessurs, Ressurs } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { IPersonIdent } from '../typer/felles';

const Personopplysninger: React.FC<{ personopplysninger: IPersonopplysninger }> = ({
    personopplysninger,
}) => {
    const [navKontor, settNavKontor] = useState<Ressurs<INavKontor>>(byggTomRessurs());
    const { axiosRequest } = useApp();

    const hentNavKontor = () =>
        axiosRequest<INavKontor, IPersonIdent>({
            method: 'POST',
            url: `/familie-ef-sak/api/personopplysninger/nav-kontor`,
            data: { personIdent: personopplysninger.personIdent },
        }).then((response) => settNavKontor(response));

    useEffect(() => {
        hentNavKontor();
        // eslint-disable-next-line
    }, [personopplysninger]);

    return (
        <PersonopplysningerMedNavKontor
            personopplysninger={personopplysninger}
            navKontor={navKontor}
        />
    );
};
export default Personopplysninger;
