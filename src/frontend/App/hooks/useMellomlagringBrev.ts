import { useApp } from '../context/AppContext';
import { byggTomRessurs, Ressurs, RessursFeilet, RessursSuksess } from '../typer/ressurs';
import { useCallback, useEffect, useState } from 'react';
import {
    FlettefeltMedVerdi,
    Fritekstområder,
    MellomlagerRespons,
    OverstyrteDelmaler,
    ValgteDelmaler,
    ValgtFelt,
} from '../../Komponenter/Behandling/Brev/BrevTyper';

export interface IMellomlagretBrev {
    brevverdier: string;
    brevmal: string;
    versjon: string;
}

export interface IBrevverdier {
    flettefeltFraMellomlager: FlettefeltMedVerdi[];
    valgteFeltFraMellomlager: ValgtFelt;
    valgteDelmalerFraMellomlager: ValgteDelmaler;
    fritekstområderFraMellomlager: Fritekstområder;
    overstyrteDelmalerFraMellomlager: OverstyrteDelmaler;
}

export interface IMellomlagreBrevRequest {
    flettefelt: FlettefeltMedVerdi[];
    valgteFelt: ValgtFelt;
    valgteDelmaler: ValgteDelmaler;
    brevmal: string;
}

export interface IMellomlagretBrevResponse {
    brevverdier?: string;
    brevmal: string;
}

export type MellomlagreSanitybrev = (
    flettefelt: FlettefeltMedVerdi[],
    valgteFelt: ValgtFelt,
    valgteDelmaler: ValgteDelmaler,
    fritekstområder: Fritekstområder,
    overstyrteDelmaler: OverstyrteDelmaler,
    brevmal: string
) => void;

export const useMellomlagringBrev = (
    behandlingId: string
): {
    mellomlagreSanitybrev: MellomlagreSanitybrev;
    mellomlagretBrev: Ressurs<MellomlagerRespons | undefined>;
} => {
    const { axiosRequest } = useApp();
    const [mellomlagretBrevRessurs, settMellomlagretBrevRessurs] =
        useState<Ressurs<MellomlagerRespons | undefined>>(byggTomRessurs());

    const sanityVersjon = '1';

    const mellomlagreSanitybrev = (
        flettefelt: FlettefeltMedVerdi[],
        valgteFelt: ValgtFelt,
        valgteDelmaler: ValgteDelmaler,
        fritekstområder: Fritekstområder,
        overstyrteDelmaler: OverstyrteDelmaler,
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
                    fritekstområderFraMellomlager: fritekstområder,
                    overstyrteDelmalerFraMellomlager: overstyrteDelmaler,
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
                url: `/familie-ef-sak/api/brev/mellomlager/${behandlingId}`,
                params: { sanityVersjon },
            }).then((res: RessursSuksess<MellomlagerRespons | undefined> | RessursFeilet) => {
                settMellomlagretBrevRessurs(res);
            }),
        // eslint-disable-next-line
        [behandlingId]
    );

    useEffect(() => {
        hentMellomlagretBrev();
    }, [behandlingId, hentMellomlagretBrev]);

    return {
        mellomlagreSanitybrev,
        mellomlagretBrev: mellomlagretBrevRessurs,
    };
};
