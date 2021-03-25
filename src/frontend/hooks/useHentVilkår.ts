import { byggTomRessurs, Ressurs, RessursStatus, RessursSuksess } from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useState } from 'react';
import {
    IVilkår,
    IVurdering,
    NullstillVilkårsvurdering,
    OppdaterVilkårsvurdering,
    Vurderingsfeilmelding,
} from '../komponenter/Behandling/Inngangsvilkår/vilkår';

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

export const useHentVilkår = (): {
    vilkår: Ressurs<IVilkår>;
    hentVilkår: (behandlingId: string) => void;
    lagreVurdering: (vurdering: OppdaterVilkårsvurdering) => Promise<Ressurs<IVurdering>>;
    feilmeldinger: Vurderingsfeilmelding;
    nullstillVurdering: (
        nullstillVilkårsvurdering: NullstillVilkårsvurdering
    ) => Promise<Ressurs<IVurdering>>;
} => {
    const { axiosRequest } = useApp();

    const [feilmeldinger, settFeilmeldinger] = useState<Vurderingsfeilmelding>({});

    const [vilkår, settVilkår] = useState<Ressurs<IVilkår>>(byggTomRessurs());

    function fjernFeilmelding(id: string) {
        settFeilmeldinger((prevFeilmeldinger) => {
            const prevFeilmeldingerCopy = { ...prevFeilmeldinger };
            delete prevFeilmeldingerCopy[id];
            return prevFeilmeldingerCopy;
        });
    }

    function leggTilFeilmelding(id: string, feilmelding: string) {
        settFeilmeldinger((prevFeilmeldinger) => {
            return {
                ...prevFeilmeldinger,
                [id]: feilmelding,
            };
        });
    }

    const lagreVurdering = (vurdering: OppdaterVilkårsvurdering): Promise<Ressurs<IVurdering>> => {
        return axiosRequest<IVurdering, OppdaterVilkårsvurdering>({
            method: 'POST',
            url: `/familie-ef-sak/api/vurdering/vilkar`,
            data: vurdering,
        }).then((respons: Ressurs<IVurdering>) => {
            switch (respons.status) {
                case RessursStatus.SUKSESS:
                    fjernFeilmelding(respons.data.id);
                    settVilkår((prevInngangsvilkår: Ressurs<IVilkår>) =>
                        oppdaterInngangsvilkårMedVurdering(
                            prevInngangsvilkår as RessursSuksess<IVilkår>, // prevInngangsvilkår kan ikke være != SUKESS her
                            respons.data
                        )
                    );
                    return respons;
                case RessursStatus.FEILET:
                case RessursStatus.FUNKSJONELL_FEIL:
                case RessursStatus.IKKE_TILGANG:
                    leggTilFeilmelding(vurdering.id, respons.frontendFeilmelding);
                    return respons;
                default:
                    return respons;
            }
        });
    };

    const nullstillVurdering = (
        nullstillVilkårsvurdering: NullstillVilkårsvurdering
    ): Promise<Ressurs<IVurdering>> => {
        return axiosRequest<IVurdering, NullstillVilkårsvurdering>({
            method: 'POST',
            url: `/familie-ef-sak/api/vurdering/nullstill`,
            data: nullstillVilkårsvurdering,
        }).then((respons: Ressurs<IVurdering>) => {
            switch (respons.status) {
                case RessursStatus.SUKSESS:
                    settVilkår((prevInngangsvilkår: Ressurs<IVilkår>) =>
                        oppdaterInngangsvilkårMedVurdering(
                            prevInngangsvilkår as RessursSuksess<IVilkår>, // prevInngangsvilkår kan ikke være != SUKESS her
                            respons.data
                        )
                    );
                    return respons;
                case RessursStatus.FEILET:
                case RessursStatus.FUNKSJONELL_FEIL:
                case RessursStatus.IKKE_TILGANG:
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
        nullstillVurdering,
    };
};
