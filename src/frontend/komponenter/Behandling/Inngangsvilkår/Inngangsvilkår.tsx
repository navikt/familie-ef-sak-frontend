import React, { FC, useState, useEffect } from 'react';
import { IInngangsvilkår, IVurdering, VilkårGruppe, Vurderingsfeilmelding } from './vilkår';
import { byggTomRessurs, Ressurs, RessursStatus, RessursSuksess } from '../../../typer/ressurs';
import { useApp } from '../../../context/AppContext';
import styled from 'styled-components';
import Vurdering from '../Vurdering/Vurdering';
import { useHistory } from 'react-router';
import DataViewer from '../../Felleskomponenter/DataViewer/DataViewer';
import { Knapp } from 'nav-frontend-knapper';

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
    const [postInngangsvilkårSuccess, settPostInngangsvilkårSuccess] = useState(false);
    const [postOvergangsstønadSuccess, settPostOvergangsstønadSuccess] = useState(false);
    const [feiledeKall, settFeiledeKall] = useState<string[]>([]);
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
        postInngangsvilkårSuccess &&
            postOvergangsstønadSuccess &&
            history.push(`/behandling/${behandlingId}/inntekt`);
    }, [postInngangsvilkårSuccess, postOvergangsstønadSuccess]);

    const ferdigVurdert = (behandlingId: string): any => {
        axiosRequest<any, any>({
            method: 'POST',
            url: `http://localhost:8000/familie-ef-sak/api/vurdering/${behandlingId}/inngangsvilkar/fullfor`,
        }).then((respons: any) => {
            switch (respons.status) {
                case RessursStatus.SUKSESS:
                    settPostInngangsvilkårSuccess(true);
                    return respons;
                case RessursStatus.FEILET:
                case RessursStatus.FUNKSJONELL_FEIL:
                case RessursStatus.IKKE_TILGANG:
                    settFeiledeKall(feiledeKall.concat('inngangsvilkar'));
                    return respons;
                default:
                    return respons;
            }
        });

        axiosRequest<any, any>({
            method: 'POST',
            url: `http://localhost:8000/familie-ef-sak/api/vurdering/${behandlingId}/overgangsstønad/fullfor`,
        }).then((respons: any) => {
            switch (respons.status) {
                case RessursStatus.SUKSESS:
                    settPostOvergangsstønadSuccess(true);
                    return respons;
                case RessursStatus.FEILET:
                case RessursStatus.FUNKSJONELL_FEIL:
                case RessursStatus.IKKE_TILGANG:
                    settFeiledeKall(feiledeKall.concat('overgangsstønad'));
                    return respons;
                default:
                    return respons;
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
            <StyledKnapp onClick={() => ferdigVurdert(behandlingId)}>Gå videre</StyledKnapp>
            <DataViewer response={inngangsvilkår}>
                {(data) => (
                    <StyledInngangsvilkår>
                        {Object.keys(VilkårGruppe).map((vilkårGruppe) => (
                            <Vurdering
                                key={vilkårGruppe}
                                vilkårGruppe={vilkårGruppe as VilkårGruppe}
                                inngangsvilkår={data}
                                feilmeldinger={feilmeldinger}
                                lagreVurdering={lagreVurdering}
                            />
                        ))}
                    </StyledInngangsvilkår>
                )}
            </DataViewer>
        </>
    );
};

export default Inngangsvilkår;
