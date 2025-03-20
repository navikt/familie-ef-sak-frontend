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
    InngangsvilkårType,
    IVilkår,
    IVurdering,
    OppdaterVilkårsvurdering,
    SvarPåVilkårsvurdering,
    Vurderingsfeilmelding,
} from '../../Komponenter/Behandling/Inngangsvilkår/vilkår';
import { useHentGjenbrukbareVilkårsvurderinger } from './useHentGjenbrukbareVilkårsvurderinger';
import { Samværsavtale } from '../typer/samværsavtale';

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

interface GjenbruktVilkårResponse {
    vilkårsvurdering: IVurdering;
    samværsavtaler: Samværsavtale[];
}

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
    gjenbrukEnkelVilkårsvurdering: (behandlingId: string, vilkårId: string) => void;
    gjenbrukbareVilkårsvurderinger: string[];
}

export const useVilkår = (
    settSamværsavtaler: React.Dispatch<React.SetStateAction<Ressurs<Samværsavtale[]>>>
): UseVilkår => {
    const { axiosRequest } = useApp();
    const { hentAlleGjenbrukbareVilkårsvurderinger, gjenbrukbareVilkårsvurderinger } =
        useHentGjenbrukbareVilkårsvurderinger();

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
        async (behandlingId: string) => {
            const hentetInngangsvilkår = await axiosRequest<IVilkår, void>({
                method: 'GET',
                url: `/familie-ef-sak/api/vurdering/${behandlingId}/vilkar`,
            });
            hentAlleGjenbrukbareVilkårsvurderinger(behandlingId);
            settVilkår(hentetInngangsvilkår);
        },
        [axiosRequest, hentAlleGjenbrukbareVilkårsvurderinger]
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

    const gjenbrukEnkelVilkårsvurdering = useCallback(
        (behandlingId: string, vilkårId: string) => {
            axiosRequest<GjenbruktVilkårResponse, { behandlingId: string; vilkårId: string }>({
                method: 'POST',
                url: `/familie-ef-sak/api/vurdering/gjenbruk-enkelt-vilkar`,
                data: { behandlingId: behandlingId, vilkårId: vilkårId },
            }).then((respons: RessursSuksess<GjenbruktVilkårResponse> | RessursFeilet) => {
                if (respons.status === RessursStatus.SUKSESS) {
                    const gjenbruktVilkår = respons.data.vilkårsvurdering;
                    const samværsavtaler = respons.data.samværsavtaler;

                    settVilkår((prevInngangsvilkår) =>
                        oppdaterInngangsvilkårMedVurdering(
                            prevInngangsvilkår as RessursSuksess<IVilkår>,
                            gjenbruktVilkår
                        )
                    );
                    if (gjenbruktVilkår.vilkårType === InngangsvilkårType.ALENEOMSORG) {
                        settSamværsavtaler({ data: samværsavtaler, status: RessursStatus.SUKSESS });
                    }
                } else {
                    leggTilFeilmelding(vilkårId, respons.frontendFeilmelding);
                }
            });
        },
        [axiosRequest, settSamværsavtaler]
    );

    return {
        vilkår,
        hentVilkår,
        lagreVurdering,
        feilmeldinger,
        nullstillVurdering,
        ikkeVurderVilkår,
        oppdaterGrunnlagsdataOgHentVilkår,
        gjenbrukEnkelVilkårsvurdering,
        gjenbrukbareVilkårsvurderinger,
    };
};
