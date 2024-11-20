import {
    byggHenterRessurs,
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
import { EToast } from '../typer/toast';

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

export interface UseVilkår {
    vilkår: Ressurs<IVilkår>;
    hentVilkår: (behandlingId: string) => void;
    oppdaterGrunnlagsdataOgHentVilkår: (behandlingId: string) => Promise<void>;
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
    gjenbrukInngangsvilkår: (
        behandlingId: string,
        kopierBehandlingId: string,
        vilkårId?: string
    ) => void;
    gjenbrukEnkeltInngangsvilkår: (behandlingId: string, vilkårId: string) => void;
}

export const useVilkår = (): UseVilkår => {
    const { axiosRequest, settToast } = useApp();

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
        (behandlingId: string) => {
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
        (behandlingId: string) =>
            axiosRequest<IVilkår, void>({
                method: 'GET',
                url: `/familie-ef-sak/api/vurdering/${behandlingId}/oppdater`,
            }).then((hentetInngangsvilkår: RessursSuksess<IVilkår> | RessursFeilet) => {
                settVilkår(hentetInngangsvilkår);
            }),
        [axiosRequest]
    );
    const gjenbrukInngangsvilkår = useCallback(
        (behandlingId: string, kopierBehandlingId: string) => {
            settVilkår(byggHenterRessurs());
            axiosRequest<IVilkår, { behandlingId: string; kopierBehandlingId: string }>({
                method: 'POST',
                url: `/familie-ef-sak/api/vurdering/gjenbruk`,
                data: { behandlingId: behandlingId, kopierBehandlingId: kopierBehandlingId },
            }).then((respons: RessursSuksess<IVilkår> | RessursFeilet) => {
                settVilkår(respons);
                if (respons.status === RessursStatus.SUKSESS) {
                    settToast(EToast.INNGANGSVILKÅR_GJENBRUKT);
                }
            });
        },
        [axiosRequest, settToast]
    );

    const gjenbrukEnkeltInngangsvilkår = useCallback(
        (behandlingId: string, vilkårId: string) => {
            axiosRequest<IVurdering, { behandlingId: string; vilkårId: string }>({
                method: 'POST',
                url: `/familie-ef-sak/api/vurdering/gjenbruk-enkelt-vilkår`,
                data: { behandlingId: behandlingId, vilkårId: vilkårId },
            }).then((respons: RessursSuksess<IVurdering> | RessursFeilet) => {
                settVilkår((prevVilkår) => {
                    if (
                        prevVilkår.status === RessursStatus.SUKSESS &&
                        respons.status === RessursStatus.SUKSESS
                    ) {
                        return {
                            ...prevVilkår,
                            status: RessursStatus.SUKSESS,
                            data: {
                                ...prevVilkår.data,
                                vurderinger: prevVilkår.data.vurderinger.map((vurdering) =>
                                    vurdering.id === respons.data.id ? respons.data : vurdering
                                ),
                            },
                        };
                    }
                    return prevVilkår;
                });
                if (respons.status === RessursStatus.SUKSESS) {
                    settToast(EToast.INNGANGSVILKÅR_GJENBRUKT);
                }
            });
        },
        [axiosRequest, settToast]
    );

    return {
        vilkår,
        hentVilkår,
        lagreVurdering,
        feilmeldinger,
        nullstillVurdering,
        ikkeVurderVilkår,
        oppdaterGrunnlagsdataOgHentVilkår,
        gjenbrukInngangsvilkår,
        gjenbrukEnkeltInngangsvilkår,
    };
};
