import React, { FC, useEffect, useState } from 'react';
import { IInngangsvilkår, IVurdering, VilkårGruppe, Vurderingsfeilmelding } from './vilkår';
import { byggTomRessurs, Ressurs, RessursStatus, RessursSuksess } from '../../../typer/ressurs';
import { useApp } from '../../../context/AppContext';
import styled from 'styled-components';
import Vurdering from '../Vurdering/Vurdering';
import { useHistory } from 'react-router';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { Knapp } from 'nav-frontend-knapper';
import { AlertStripeFeil } from 'nav-frontend-alertstriper';

const StyledInngangsvilkår = styled.div`
    margin: 2rem;
    display: grid;
    grid-template-columns: repeat(2, max-content);
    grid-auto-rows: auto;
    grid-gap: 3rem;
`;

const StyledKnapp = styled(Knapp)`
    margin: 0 auto;
    display: block;
    margin-top: 2rem;
`;

interface Props {
    behandlingId: string;
}

const oppdaterInngangsvilkårMedVurdering = (
    inngangsvilkår: RessursSuksess<IInngangsvilkår>,
    vurdering: IVurdering
) => ({
    ...inngangsvilkår,
    data: {
        ...inngangsvilkår.data,
        vurderinger: inngangsvilkår.data.vurderinger.map((tidligereVurdering) =>
            tidligereVurdering.id === vurdering.id ? vurdering : tidligereVurdering
        ),
    },
});

const Inngangsvilkår: FC<Props> = ({ behandlingId }) => {
    const [inngangsvilkår, settInngangsvilkår] = useState<Ressurs<IInngangsvilkår>>(
        byggTomRessurs()
    );
    const history = useHistory();
    const [feilmeldinger, settFeilmeldinger] = useState<Vurderingsfeilmelding>({});
    const [postInngangsvilkårSuksess, settPostInngangsvilkårSuksess] = useState(false);
    const [postOvergangsstønadSuksess, settPostOvergangsstønadSuksess] = useState(false);
    const [feilmelding, settFeilmelding] = useState<string>();
    const { axiosRequest } = useApp();

    const hentInngangsvilkår = (behandlingId: string) => {
        axiosRequest<IInngangsvilkår, void>({
            method: 'GET',
            url: `/familie-ef-sak/api/vurdering/${behandlingId}/inngangsvilkar`,
        }).then((hentetInngangsvilkår: Ressurs<IInngangsvilkår>) => {
            settInngangsvilkår(hentetInngangsvilkår);
        });
    };

    function fjernFeilemelding(vurdering: IVurdering) {
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

    useEffect(() => {
        postInngangsvilkårSuksess &&
            postOvergangsstønadSuksess &&
            history.push(`/behandling/${behandlingId}/inntekt`);
    }, [postInngangsvilkårSuksess, postOvergangsstønadSuksess]);

    const ferdigVurdert = (behandlingId: string): any => {
        const postInngangsvilkår = (): Promise<Ressurs<string>> => {
            return axiosRequest<any, any>({
                method: 'POST',
                url: `/familie-ef-sak/api/vurdering/${behandlingId}/inngangsvilkar/fullfor`,
            });
        };

        const postOvergangsstønad = (): Promise<Ressurs<string>> => {
            return axiosRequest<any, any>({
                method: 'POST',
                url: `/familie-ef-sak/api/vurdering/${behandlingId}/overgangsstonad/fullfor`,
            });
        };

        // TODO: Kun for dummy-flyt - må forbedres/omskrives
        postInngangsvilkår().then((responseInngangsvilkår) => {
            if (responseInngangsvilkår.status === RessursStatus.SUKSESS) {
                postOvergangsstønad().then((responseStønadsvilkår) => {
                    if (responseStønadsvilkår.status === RessursStatus.SUKSESS) {
                        settPostInngangsvilkårSuksess(true);
                        settPostOvergangsstønadSuksess(true);
                    } else if (
                        responseStønadsvilkår.status === RessursStatus.IKKE_TILGANG ||
                        responseStønadsvilkår.status === RessursStatus.FEILET ||
                        responseStønadsvilkår.status === RessursStatus.FUNKSJONELL_FEIL
                    ) {
                        settPostOvergangsstønadSuksess(false);
                        settFeilmelding(responseStønadsvilkår.frontendFeilmelding);
                    }
                });
            } else if (
                responseInngangsvilkår.status === RessursStatus.IKKE_TILGANG ||
                responseInngangsvilkår.status === RessursStatus.FEILET ||
                responseInngangsvilkår.status === RessursStatus.FUNKSJONELL_FEIL
            ) {
                settPostInngangsvilkårSuksess(false);
                settFeilmelding(responseInngangsvilkår.frontendFeilmelding);
            }
        });
    };

    const lagreVurdering = (vurdering: IVurdering): Promise<Ressurs<string>> => {
        return axiosRequest<string, IVurdering>({
            method: 'POST',
            url: `/familie-ef-sak/api/vurdering/inngangsvilkar`,
            data: vurdering,
        }).then((respons: Ressurs<string>) => {
            switch (respons.status) {
                case RessursStatus.SUKSESS:
                    fjernFeilemelding(vurdering);
                    settInngangsvilkår((prevInngangsvilkår: Ressurs<IInngangsvilkår>) =>
                        oppdaterInngangsvilkårMedVurdering(
                            prevInngangsvilkår as RessursSuksess<IInngangsvilkår>, // prevInngangsvilkår kan ikke være != SUKESS her
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

    React.useEffect(() => {
        if (behandlingId !== undefined) {
            if (inngangsvilkår.status !== RessursStatus.SUKSESS) {
                hentInngangsvilkår(behandlingId);
            }
        }
    }, [behandlingId]);
    return (
        <>
            {feilmelding && <AlertStripeFeil children={feilmelding} />}
            <StyledKnapp onClick={() => ferdigVurdert(behandlingId)}>Gå videre</StyledKnapp>
            <DataViewer response={inngangsvilkår}>
                {(data) => (
                    <StyledInngangsvilkår>
                        {Object.keys(VilkårGruppe).map((vilkårGruppe) => {
                            if (vilkårGruppe === VilkårGruppe.ALENEOMSORG) {
                                return data.grunnlag.barnMedSamvær.map((barn) => {
                                    return (
                                        <Vurdering
                                            key={barn.barneId}
                                            barneId={barn.barneId}
                                            vilkårGruppe={vilkårGruppe}
                                            inngangsvilkår={data}
                                            lagreVurdering={lagreVurdering}
                                            feilmeldinger={feilmeldinger}
                                        />
                                    );
                                });
                            } else {
                                return (
                                    <Vurdering
                                        key={vilkårGruppe}
                                        vilkårGruppe={vilkårGruppe as VilkårGruppe}
                                        inngangsvilkår={data}
                                        feilmeldinger={feilmeldinger}
                                        lagreVurdering={lagreVurdering}
                                    />
                                );
                            }
                        })}
                    </StyledInngangsvilkår>
                )}
            </DataViewer>
        </>
    );
};

export default Inngangsvilkår;
