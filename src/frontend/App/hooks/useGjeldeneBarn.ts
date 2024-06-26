import { useEffect, useState } from 'react';
import { useBehandling } from '../context/BehandlingContext';
import { IBarn } from '../typer/personopplysninger';

export const useGjeldendeBarn = (barnIdent: string | undefined) => {
    const { personopplysningerResponse } = useBehandling();
    const [gjeldendeBarn, setGjeldendeBarn] = useState<IBarn | undefined>(undefined);

    useEffect(() => {
        if (personopplysningerResponse.status === 'SUKSESS') {
            const barn = personopplysningerResponse.data.barn.find(
                (barn) => barn.personIdent === barnIdent
            );
            setGjeldendeBarn(barn);
        }
    }, [personopplysningerResponse, barnIdent]);

    return gjeldendeBarn;
};
