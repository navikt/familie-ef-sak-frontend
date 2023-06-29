import { useApp } from '../context/AppContext';
import { byggTomRessurs, Ressurs, RessursFeilet, RessursSuksess } from '../typer/ressurs';
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from 'react';
import {
    FlettefeltMedVerdi,
    Fritekstområder,
    MellomlagerRespons,
    ValgteDelmaler,
    ValgtFelt,
} from '../../Komponenter/Behandling/Brev/BrevTyper';
import { IMellomlagretBrev, MellomlagreSanitybrev } from './useMellomlagringBrev';

export const useMellomlagringFrittståendeSanitybrev = (
    fagsakId: string
): {
    mellomlagreSanitybrev: MellomlagreSanitybrev;
    mellomlagretBrev: Ressurs<MellomlagerRespons | undefined>;
    settMellomlagretBrev: Dispatch<SetStateAction<Ressurs<MellomlagerRespons | undefined>>>;
} => {
    const { axiosRequest } = useApp();
    const [mellomlagretBrevRessurs, settMellomlagretBrevRessurs] = useState<
        Ressurs<MellomlagerRespons | undefined>
    >(byggTomRessurs());

    const sanityVersjon = '1';

    const mellomlagreSanitybrev = (
        flettefelt: FlettefeltMedVerdi[],
        valgteFelt: ValgtFelt,
        valgteDelmaler: ValgteDelmaler,
        fritekstområder: Fritekstområder,
        brevmal: string
    ): void => {
        axiosRequest<string, IMellomlagretBrev>({
            method: 'POST',
            url: `/familie-ef-sak/api/brev/mellomlager/fagsak/${fagsakId}`,
            data: {
                brevverdier: JSON.stringify({
                    flettefeltFraMellomlager: flettefelt,
                    valgteFeltFraMellomlager: valgteFelt,
                    valgteDelmalerFraMellomlager: valgteDelmaler,
                    fritekstområderFraMellomlager: fritekstområder,
                }),
                brevmal,
                versjon: sanityVersjon,
            },
        });
    };

    const hentMellomlagretBrev = useCallback(
        () =>
            axiosRequest<MellomlagerRespons | undefined, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/brev/mellomlager/fagsak/${fagsakId}`,
            }).then((res: RessursSuksess<MellomlagerRespons | undefined> | RessursFeilet) => {
                settMellomlagretBrevRessurs(res);
            }),
        // eslint-disable-next-line
        [fagsakId]
    );

    useEffect(() => {
        hentMellomlagretBrev();
    }, [fagsakId, hentMellomlagretBrev]);

    return {
        mellomlagreSanitybrev,
        mellomlagretBrev: mellomlagretBrevRessurs,
        settMellomlagretBrev: settMellomlagretBrevRessurs,
    };
};
