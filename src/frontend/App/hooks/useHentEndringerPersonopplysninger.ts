import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import {
    byggSuksessRessurs,
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursSuksess,
} from '../typer/ressurs';
import { IEndringerPersonopplysninger } from '../../Komponenter/Behandling/Endring/personopplysningerEndringer';

interface Props {
    endringerPersonopplysninger: Ressurs<IEndringerPersonopplysninger | undefined>;
    nullstillGrunnlagsendringer: () => void;
    hentEndringerForPersonopplysninger: (behandlingId: string) => void;
}

export const useHentEndringerPersonopplysninger = (): Props => {
    const [endringerPersonopplysninger, settGrunnlagsendringer] = useState<
        Ressurs<IEndringerPersonopplysninger | undefined>
    >(byggTomRessurs());

    const { axiosRequest } = useApp();

    const hentEndringerForPersonopplysninger = useCallback(
        (behandlingId: string) => {
            axiosRequest<IEndringerPersonopplysninger, void>({
                method: 'GET',
                url: `/familie-ef-sak/api/personopplysninger/behandling/${behandlingId}/endringer`,
            }).then((respons: RessursSuksess<IEndringerPersonopplysninger> | RessursFeilet) => {
                settGrunnlagsendringer(respons);
            });
        },
        [axiosRequest]
    );

    return {
        endringerPersonopplysninger,
        nullstillGrunnlagsendringer: () => settGrunnlagsendringer(byggSuksessRessurs(undefined)),
        hentEndringerForPersonopplysninger,
    };
};
