import { byggTomRessurs, Ressurs, RessursStatus, RessursSuksess } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useState } from 'react';
import { IVilkår, IVurdering, Vurderingsfeilmelding } from '../komponenter/Behandling/Inngangsvilkår/vilkår';

const oppdaterInngangsvilkårMedVurdering = (
    vilkår: RessursSuksess<IVilkår>,
    vurdering: IVurdering
) => ({
    ...vilkår,
    data: {
        ...vilkår.data,
        vurderinger: vilkår.data.vurderinger.map((tidligereVurdering) =>
            tidligereVurdering.id === vurdering.id ? vurdering : tidligereVurdering
        ),
    },
});

export const useHentVilkår = (
    behandlingId: string
): {
    vilkår: Ressurs<IVilkår>,
    hentVilkår: (behandlingId: string) => void,
    lagreVurdering: (vurdering: IVurdering) => Promise<Ressurs<string>>,
    feilmeldinger: Vurderingsfeilmelding
} => {
    const { axiosRequest } = useApp();

    const [feilmeldinger, settFeilmeldinger] = useState<Vurderingsfeilmelding>({});

    const [vilkår, settVilkår] = useState<Ressurs<IVilkår>>(
        byggTomRessurs()
    );

    function fjernFeilmelding(vurdering: IVurdering) {
        settFeilmeldinger((prevFeilmeldinger) => {
            const prevFeilmeldingerCopy = { ...prevFeilmeldinger };
            delete prevFeilmeldingerCopy[vurdering.id];
            return prevFeilmeldingerCopy;
        });
    }

    function leggTilFeilmelding(vurdering: IVurdering, feilmelding: string) {
        settFeilmeldinger((prevFeilmeldinger) => {
            return {
                ...prevFeilmeldinger,
                [vurdering.id]: feilmelding,
            };
        });
    }

    const lagreVurdering = (vurdering: IVurdering): Promise<Ressurs<string>> => {
        return axiosRequest<string, IVurdering>({
            method: 'POST',
            url: `/familie-ef-sak/api/vurdering/vilkar`,
            data: vurdering,
        }).then((respons: Ressurs<string>) => {
            switch (respons.status) {
                case RessursStatus.SUKSESS:
                    fjernFeilmelding(vurdering);
                    settVilkår((prevInngangsvilkår: Ressurs<IVilkår>) =>
                        oppdaterInngangsvilkårMedVurdering(
                            prevInngangsvilkår as RessursSuksess<IVilkår>, // prevInngangsvilkår kan ikke være != SUKESS her
                            vurdering
                        )
                    );
                    return respons;
                case RessursStatus.FEILET:
                case RessursStatus.FUNKSJONELL_FEIL:
                case RessursStatus.IKKE_TILGANG:
                    leggTilFeilmelding(vurdering, respons.frontendFeilmelding);
                    return respons;
                default:
                    return respons;
            }
        });
    };

    const hentVilkår = (behandlingId: string) => {
        axiosRequest<IVilkår, void>({
            method: 'GET',
            url: `/familie-ef-sak/api/vurdering/${behandlingId}/vilkar`,
        }).then((hentetInngangsvilkår: Ressurs<IVilkår>) => {
            settVilkår(hentetInngangsvilkår);
        });
    };

    return {
        vilkår,
        hentVilkår,
        lagreVurdering,
        feilmeldinger,
    };
};
