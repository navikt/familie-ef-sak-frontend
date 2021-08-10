import { useApp } from '../context/AppContext';
import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../typer/ressurs';
import { useCallback, useEffect, useState } from 'react';
import { FlettefeltMedVerdi, ValgteDelmaler, ValgtFelt } from '../Behandling/Brev/BrevTyper';

export interface IMellomlagretBrev {
    brevverdier: string;
    brevmal: string;
    versjon: string;
}

export interface IBrevverdier {
    flettefeltFraMellomlager: FlettefeltMedVerdi[];
    valgteFeltFraMellomlager: ValgtFelt;
    valgteDelmalerFraMellomlager: ValgteDelmaler;
}

export const useMellomlagringBrev = (behandlingId: string) => {
    const { axiosRequest } = useApp();
    const [mellomlagretBrevRessurs, settMellomlagretBrevRessurs] = useState<
        Ressurs<string | undefined>
    >(byggTomRessurs());

    const mellomlagreBrev = (
        flettefelt: FlettefeltMedVerdi[],
        valgteFelt: ValgtFelt,
        valgteDelmaler: ValgteDelmaler,
        brevmal: string
    ): void => {
        axiosRequest<string, IMellomlagretBrev>({
            method: 'POST',
            url: `/familie-ef-sak/api/brev/mellomlager/${behandlingId}`,
            data: {
                brevverdier: JSON.stringify({
                    flettefeltFraMellomlager: flettefelt,
                    valgteFeltFraMellomlager: valgteFelt,
                    valgteDelmalerFraMellomlager: valgteDelmaler,
                }),
                brevmal,
                versjon: '1',
            },
        }).then((res: RessursSuksess<string> | RessursFeilet) => {
            if (res.status === RessursStatus.SUKSESS) {
                Promise.resolve();
            }
            Promise.reject();
        });
    };

    const hentMellomlagretBrev = useCallback(
        () =>
            axiosRequest<string | undefined, null>({
                method: 'GET',
                url: `/familie-ef-sak/api/brev/mellomlager/${behandlingId}`,
            }).then((res: RessursSuksess<string | undefined> | RessursFeilet) => {
                settMellomlagretBrevRessurs(res);
            }),
        // eslint-disable-next-line
        [behandlingId]
    );

    useEffect(() => {
        hentMellomlagretBrev();
    }, [behandlingId, hentMellomlagretBrev]);

    return {
        mellomlagreBrev,
        mellomlagretBrev: mellomlagretBrevRessurs,
    };
};
