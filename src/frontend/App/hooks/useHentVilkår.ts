import {
    byggTomRessurs,
    Ressurs,
    RessursFeilet,
    RessursStatus,
    RessursSuksess,
} from '../typer/ressurs';
import { useApp } from '../context/AppContext';
import { useCallback, useState } from 'react';
import {
    IVilkår,
    IVurdering,
    OppdaterVilkårsvurdering,
    SvarPåVilkårsvurdering,
    Vurderingsfeilmelding,
} from '../../Komponenter/Behandling/Inngangsvilkår/vilkår';

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
    oppdaterGrunnlagsdataOgHentVilkår: (behandlingId: string) => void;
    lagreVurdering: (
        vurdering: SvarPåVilkårsvurdering
    ) => Promise<RessursSuksess<IVurdering> | RessursFeilet>;
    feilmeldinger: Vurderingsfeilmelding;
    nullstillVurdering: (
        nullstillVilkårsvurdering: OppdaterVilkårsvurdering
    ) => Promise<RessursSuksess<IVurdering> | RessursFeilet>;
    ikkeVurderVilkår: (
        nullstillVilkårsvurdering: OppdaterVilkårsvurdering
    ) => Promise<RessursSuksess<IVurdering> | RessursFeilet>;
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

    const lagreVurdering = (
        vurdering: SvarPåVilkårsvurdering
    ): Promise<RessursSuksess<IVurdering> | RessursFeilet> => {
        return axiosRequest<IVurdering, SvarPåVilkårsvurdering>({
            method: 'POST',
            url: `/familie-ef-sak/api/vurdering/vilkar`,
            data: vurdering,
        }).then((respons: RessursSuksess<IVurdering> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                fjernFeilmelding(respons.data.id);
                settVilkår((prevInngangsvilkår) =>
                    oppdaterInngangsvilkårMedVurdering(
                        prevInngangsvilkår as RessursSuksess<IVilkår>, // prevInngangsvilkår kan ikke være != SUKESS her
                        respons.data
                    )
                );
            } else {
                leggTilFeilmelding(vurdering.id, respons.frontendFeilmelding);
            }
            return respons;
        });
    };

    const nullstillVurdering = (
        nullstillVilkårsvurdering: OppdaterVilkårsvurdering
    ): Promise<RessursSuksess<IVurdering> | RessursFeilet> => {
        return axiosRequest<IVurdering, OppdaterVilkårsvurdering>({
            method: 'POST',
            url: `/familie-ef-sak/api/vurdering/nullstill`,
            data: nullstillVilkårsvurdering,
        }).then((respons: RessursSuksess<IVurdering> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                settVilkår((prevInngangsvilkår) =>
                    oppdaterInngangsvilkårMedVurdering(
                        prevInngangsvilkår as RessursSuksess<IVilkår>, // prevInngangsvilkår kan ikke være != SUKESS her
                        respons.data
                    )
                );
            }
            return respons;
        });
    };
    const ikkeVurderVilkår = (
        nullstillVilkårsvurdering: OppdaterVilkårsvurdering
    ): Promise<RessursSuksess<IVurdering> | RessursFeilet> => {
        return axiosRequest<IVurdering, OppdaterVilkårsvurdering>({
            method: 'POST',
            url: `/familie-ef-sak/api/vurdering/ikkevurder`,
            data: nullstillVilkårsvurdering,
        }).then((respons: RessursSuksess<IVurdering> | RessursFeilet) => {
            if (respons.status === RessursStatus.SUKSESS) {
                settVilkår((prevInngangsvilkår: Ressurs<IVilkår>) =>
                    oppdaterInngangsvilkårMedVurdering(
                        prevInngangsvilkår as RessursSuksess<IVilkår>, // prevInngangsvilkår kan ikke være != SUKESS her
                        respons.data
                    )
                );
            }
            return respons;
        });
    };
    const hentVilkår = useCallback(
        (behandlingId) => {
            axiosRequest<IVilkår, void>({
                method: 'GET',
                url: `/familie-ef-sak/api/vurdering/${behandlingId}/vilkar`,
            }).then((hentetInngangsvilkår: RessursSuksess<IVilkår> | RessursFeilet) => {
                settVilkår(hentetInngangsvilkår);
            });
        },
        [axiosRequest]
    );
    const oppdaterGrunnlagsdataOgHentVilkår = useCallback(
        (behandlingId) => {
            axiosRequest<IVilkår, void>({
                method: 'GET',
                url: `/familie-ef-sak/api/vurdering/${behandlingId}/oppdater`,
            }).then((hentetInngangsvilkår: RessursSuksess<IVilkår> | RessursFeilet) => {
                settVilkår(hentetInngangsvilkår);
            });
        },
        [axiosRequest]
    );

    return {
        vilkår,
        hentVilkår,
        lagreVurdering,
        feilmeldinger,
        nullstillVurdering,
        ikkeVurderVilkår,
        oppdaterGrunnlagsdataOgHentVilkår,
    };
};
